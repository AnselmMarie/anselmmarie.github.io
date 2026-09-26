#!/usr/bin/env node
/**
 * Enforces the line caps two rules assert but nothing enforced until D52:
 *
 *   .claude/rules/file-size.md          — source files, 200 lines.
 *   .claude/rules/plan-split-into-files.md — plan index 200, other plan docs 500.
 *
 * Source files are hard-gated. Plan docs are RATCHETED: one already over its cap
 * at HEAD is grandfathered at its HEAD line count and may stay over or shrink,
 * but one line of growth fails. That is the rule's own "do not use 'it is
 * already 7,000 lines' as licence to make it 7,100", with a number attached.
 *
 *   node tools/scripts/check-file-size.mjs            # changed vs HEAD + untracked
 *   node tools/scripts/check-file-size.mjs <paths...> # those paths (lint-staged)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const SOURCE_CAP = 200;
const PLAN_CAP = 500;
const PLAN_INDEX_CAP = 200;

const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];

/** Generated or vendored — real bytes, but nobody authored them line by line. */
const EXCLUDED = [
  'node_modules/',
  'dist/',
  'build/',
  'coverage/',
  'out-tsc/',
  '.nx/',
  '.output/',
  '.nitro/',
  'cdk.out/',
  'playwright-report/',
];
const EXCLUDED_SUFFIXES = ['.d.ts', 'routeTree.gen.ts'];

const git = (args) => {
  try {
    return execFileSync('git', args, { encoding: 'utf8' });
  } catch {
    return '';
  }
};

/** `wc -l` semantics: a trailing newline does not add a line. */
const countLines = (text) => {
  if (text === '') return 0;
  const normalized = text.endsWith('\n') ? text.slice(0, -1) : text;
  return normalized.split('\n').length;
};

const isExcluded = (file) =>
  EXCLUDED.some((dir) => file.includes(dir)) ||
  EXCLUDED_SUFFIXES.some((suffix) => file.endsWith(suffix));

const isSource = (file) => SOURCE_EXTENSIONS.some((ext) => file.endsWith(ext));
const isPlanDoc = (file) => file.includes('docs/planning/') && file.endsWith('.md');

/** A plan directory's index. `plan-split-into-files.md` caps it tighter. */
const isPlanIndex = (file) => isPlanDoc(file) && file.endsWith('/README.md');

const capFor = (file) => {
  if (isPlanIndex(file)) return PLAN_INDEX_CAP;
  if (isPlanDoc(file)) return PLAN_CAP;
  return SOURCE_CAP;
};

/** The file's line count at HEAD, or null when it is new. */
const linesAtHead = (file) => {
  const blob = git(['show', `HEAD:${file}`]);
  if (blob === '') return null;
  return countLines(blob);
};

const changedFiles = () => {
  const tracked = git(['diff', '--name-only', 'HEAD']);
  const untracked = git(['ls-files', '--others', '--exclude-standard']);
  const all = `${tracked}\n${untracked}`.split('\n').map((line) => line.trim());
  return [...new Set(all.filter(Boolean))];
};

/**
 * Source: over cap is a failure, full stop.
 * Plan doc: over cap is a failure UNLESS it was already over at HEAD, in which
 * case only growth fails — and a file over cap that did not grow is a warning.
 */
const judgePlanDoc = (file, lines, cap, headLines) => {
  const wasOver = headLines !== null && headLines > cap;
  if (!wasOver) {
    return { level: 'fail', text: `${file} — ${lines} lines, over the ${cap}-line cap` };
  }
  if (lines > headLines) {
    const grew = lines - headLines;
    return {
      level: 'fail',
      text: `${file} — already over cap and GREW by ${grew} lines (${headLines} → ${lines})`,
    };
  }
  return {
    level: 'warn',
    text: `${file} — ${lines} lines, over the ${cap}-line cap (grandfathered at HEAD, not grown)`,
  };
};

const judge = (file) => {
  if (!existsSync(file) || isExcluded(file)) return null;
  if (!isSource(file) && !isPlanDoc(file)) return null;

  const lines = countLines(readFileSync(file, 'utf8'));
  const cap = capFor(file);
  if (lines <= cap) return null;

  if (isPlanDoc(file)) return judgePlanDoc(file, lines, cap, linesAtHead(file));
  return { level: 'fail', text: `${file} — ${lines} lines, over the ${cap}-line cap` };
};

const report = (results) => {
  const warnings = results.filter((r) => r.level === 'warn');
  const failures = results.filter((r) => r.level === 'fail');

  for (const warning of warnings) {
    console.warn(`  ⚠ ${warning.text}`);
  }
  if (failures.length === 0) return 0;

  console.error('\nFile size check failed:\n');
  for (const failure of failures) {
    console.error(`  ✗ ${failure.text}`);
  }
  console.error('\nSplit the file rather than raising the limit — see .claude/rules/file-size.md');
  console.error('and .claude/rules/plan-split-into-files.md.\n');
  return 1;
};

const main = () => {
  const args = process.argv.slice(2);
  const files = args.length > 0 ? args : changedFiles();
  const results = files.map(judge).filter(Boolean);
  process.exit(report(results));
};

main();

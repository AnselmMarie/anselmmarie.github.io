#!/usr/bin/env node
/**
 * Every Nx project carries a `type:` and a `scope:` tag (Slice 8).
 *
 * ⚠️ `@nx/enforce-module-boundaries` is SILENTLY INERT for an untagged project:
 * no constraint matches it, so the rule passes rather than failing. Without this
 * check D2/D25/D27/D29 hold only for the projects somebody remembered to tag,
 * a gate that reports green over a growing hole.
 *
 * Reads the project graph once (`nx graph --file`), rather than one
 * `nx show project` per project. D50: the names are bare, as Nx reports them.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REQUIRED_PREFIXES = ['type:', 'scope:'];

/** @param {Record<string, { data: { tags?: string[] } }>} nodes */
export const findUntagged = (nodes) =>
  Object.entries(nodes)
    .map(([name, node]) => ({
      name,
      missing: REQUIRED_PREFIXES.filter(
        (prefix) => !(node.data.tags ?? []).some((tag) => tag.startsWith(prefix))
      ),
    }))
    .filter(({ missing }) => missing.length > 0);

const readGraphNodes = () => {
  const dir = mkdtempSync(join(tmpdir(), 'nx-graph-'));
  const file = join(dir, 'graph.json');
  try {
    execFileSync('pnpm', ['nx', 'graph', `--file=${file}`], {
      stdio: ['ignore', 'ignore', 'inherit'],
    });
    return JSON.parse(readFileSync(file, 'utf8')).graph.nodes;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

const nodes = readGraphNodes();
const untagged = findUntagged(nodes);

if (untagged.length > 0) {
  for (const { name, missing } of untagged) {
    console.error(`✖ ${name} has no ${missing.join(' or ')} tag`);
  }
  console.error('Untagged projects are unconstrained by @nx/enforce-module-boundaries.');
  process.exit(1);
}

console.log(`✔ all ${Object.keys(nodes).length} projects carry a type: and a scope: tag`);

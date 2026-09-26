#!/usr/bin/env node
/**
 * Every workspace package resolves one React major (D39, R2; Slice 8).
 *
 * ⚠️ This is the load-bearing half of D39. React is shared with
 * `strictVersion: false`, so a remote built against another major still loads,
 * and two Reacts end up in one page: hooks throw and context silently falls
 * back to its defaults. This check moves that mismatch from a visitor's browser
 * to a red build.
 *
 * It reads what each package RESOLVES, not the range it declares: a range like
 * `^19.3.0` says nothing about which copy pnpm actually linked.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const PACKAGE_GLOBS = ['apps', 'libs/features', 'libs/ui', 'libs/shared'];
const REACT_PACKAGES = ['react', 'react-dom'];

/** @param {string} version */
const majorOf = (version) => version.split('.')[0];

/**
 * @param {{ pkg: string, dep: string, version: string }[]} resolved
 * @returns {string[]} one message per mismatch; empty when every major agrees
 */
export const findMajorMismatches = (resolved) => {
  const majors = new Set(resolved.map(({ version }) => majorOf(version)));
  if (majors.size <= 1) return [];
  return resolved.map(({ pkg, dep, version }) => `${pkg} → ${dep}@${version}`);
};

/** @param {string} root */
const workspacePackageDirs = (root) =>
  PACKAGE_GLOBS.flatMap((group) =>
    readdirSync(join(root, group), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(root, group, entry.name))
  );

/** @param {string} dir */
const readReactResolutions = (dir) => {
  const manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  const declared = { ...manifest.dependencies, ...manifest.peerDependencies };
  const require = createRequire(join(dir, 'package.json'));
  return REACT_PACKAGES.filter((dep) => dep in declared).map((dep) => ({
    pkg: manifest.name,
    dep,
    version: require(`${dep}/package.json`).version,
  }));
};

const main = () => {
  const resolved = workspacePackageDirs(process.cwd()).flatMap(readReactResolutions);
  if (resolved.length === 0) {
    console.error('✖ no workspace package declares react; the check would pass over nothing');
    process.exit(1);
  }
  const mismatches = findMajorMismatches(resolved);
  if (mismatches.length > 0) {
    console.error('✖ workspace packages resolve more than one React major (D39):');
    for (const line of mismatches) console.error(`  ${line}`);
    process.exit(1);
  }
  const packages = new Set(resolved.map(({ pkg }) => pkg)).size;
  console.log(
    `✔ ${packages} packages resolve React major ${majorOf(resolved[0].version)} (${resolved.length} resolutions)`
  );
};

const isEntryPoint = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isEntryPoint) main();

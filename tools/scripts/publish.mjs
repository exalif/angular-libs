/**
 * This is a minimal script to publish your package to "npm".
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 *
 * You might need to authenticate with NPM before running this script.
 */

import nrwlDevkit from '@nrwl/devkit';
const { readCachedProjectGraph } = nrwlDevkit;

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';

function invariant(condition, message) {
  if (!condition) {
    console.error(chalk.bold.red(message));
    process.exit(1);
  }
}

const rootPath = process.cwd();
const yarnRcPath = `${rootPath}/.yarnrc.yml`;

const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;

// Executing publish script: node path/to/publish.mjs {name} --version {version} --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
const [, , name, version, tag = 'next', otp = null] = process.argv;

const usePackageJsonVersion = version === 'readFromPackageJson';
const useGlobalVersion = !!version || version === 'useGlobalVersion';

const graph = readCachedProjectGraph();
const project = graph.nodes[name];

invariant(
  project,
  `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`
);

const outputPath = project.data?.targets?.build?.outputPath;
invariant(
  outputPath,
  `Could not find "build.outputs" of project "${name}". Is project.json configured correctly?`
);

// May be needed for yarn authentication on a private repo
// copyFileSync(yarnRcPath, `${outputPath}/.yarnrc.yml`);


const { version: globalJsonVersion } = JSON.parse(readFileSync(`package.json`).toString());

if (useGlobalVersion) {
  invariant(
    globalJsonVersion && globalJsonVersion !== '0.0.0' && validVersion.test(globalJsonVersion),
    `No global version provided in root package.json or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${globalJsonVersion}.`
  );
}

process.chdir(outputPath);

const { version: distJsonVersion } = JSON.parse(readFileSync(`package.json`).toString());

if (usePackageJsonVersion) {
  invariant(
    globalJsonVersion && globalJsonVersion !== '0.0.0' && validVersion.test(globalJsonVersion),
    `No local version provided in root package.json or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${globalJsonVersion}.`
  );
}

const versionToUse = useGlobalVersion
  ? globalJsonVersion
  : usePackageJsonVersion
    ? distJsonVersion
    : version;

invariant(
  versionToUse && versionToUse !== '0.0.0' && versionToUse !== 'VERSION' && validVersion.test(versionToUse),
  `No target version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${globalJsonVersion}.`
);

if (!usePackageJsonVersion) {
  // Updating the version in package dist "package.json" before publishing

  try {
    const json = JSON.parse(readFileSync(`package.json`).toString());
    json.version = versionToUse;
    writeFileSync(`package.json`, JSON.stringify(json, null, 2));
  } catch (e) {
    console.error(
      chalk.bold.red(`Error reading package.json file from library build output.`)
    );
  }
}

// Execute "npm publish" to publish
try {
  otp
    ? execSync(`npm publish --otp=${otp}`, { stdio: 'inherit' })
    : execSync(`npm publish`, { stdio: 'inherit' });
} catch (e) {
  console.error(
    chalk.bold.red(`Error while publishing`),
    e,
  );
}


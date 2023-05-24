/**
 * This is a minimal script to publish your package to "npm".
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 *
 * You might need to authenticate with NPM before running this script.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';
import devkit from '@nx/devkit';

const { readCachedProjectGraph } = devkit;

function invariant(condition, message) {
  if (!condition) {
    console.error(chalk.bold.red(message));
    process.exit(1);
  }
}

const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;
const invalidVersions = [
  'VERSION',
  'version',
  '0.0.0',
];

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

/** May be required for private repositories to have a yarnrc file with credentials in the dist dir of the package */
// const rootPath = process.cwd();
// const yarnRcPath = `${rootPath}/.yarnrc.yml`;
// copyFileSync(yarnRcPath, `${outputPath}/.yarnrc.yml`);

const { version: globalJsonVersion } = JSON.parse(readFileSync(`package.json`).toString());
const distPackageJsonpath = path.join(outputPath, 'package.json');
const { version: distJsonVersion } = JSON.parse(readFileSync(distPackageJsonpath).toString());

const versionToUse = useGlobalVersion
  ? globalJsonVersion
  : usePackageJsonVersion
    ? distJsonVersion
    : version;

invariant(
  versionToUse && !invalidVersions.includes(versionToUse) && validVersion.test(versionToUse),
  `No target version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${versionToUse} with tags
    - useGlobalVersion: ${useGlobalVersion.toString()}
    - usePackageJsonVersion: ${usePackageJsonVersion.toString()}`
);

/**
 * In case we want to change the version in package dist 'package.json' file
 * to use the computed version we need to update the file before publishing.
 */
if (!usePackageJsonVersion) {
  try {
    const json = JSON.parse(readFileSync(distPackageJsonpath).toString());
    json.version = versionToUse;

    writeFileSync(distPackageJsonpath, JSON.stringify(json, null, 2));
  } catch (e) {
    console.error(
      chalk.bold.red(`Error reading package.json file from library build output.`)
    );
  }
}

/**
 * Execute 'npm publish' with proper arguments
 *
 */
try {
  const command = `npm publish --access public ${otp ? `--otp=${otp}` : ``} ${tag ? `--tag=${tag}` : ``}`;

  process.chdir(outputPath);
  execSync(command, { stdio: 'inherit' })
} catch (e) {
  console.error(
    chalk.bold.red(`Error while publishing`),
    e,
  );
}


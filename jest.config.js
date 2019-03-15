module.exports = {
  setupFilesAfterEnv: ['<rootDir>/setupJest.ts'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: [require.resolve('jest-preset-angular/InlineHtmlStripStylesTransformer')],
    },
  },
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  testEnvironment: 'jest-environment-jsdom-thirteen',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|js)?(x)',
    '**/+(*.)+(spec).+(ts|js)?(x)'
  ],
  moduleFileExtensions: [
    'ts',
    'js',
    'html'
  ],
  moduleNameMapper: {
    '@exalif/ngx-breadcrumbs/(.*)': '<rootDir>/dist/exalif/ngx-breadcrumbs/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!@ngrx|@ngx-translate)'
  ],
  coverageReporters: ['html', 'text-summary', 'text'],
  collectCoverageFrom: [
    'projects/exalif/ngx-breadcrumbs/src/**/*.ts',
    'projects/angular-libs-demo/src/app/**/*.ts',

    // Exclusions
    '!tests/**/*.ts',
    '!src/app/**/*.js',
    '!src/environments/*.ts',
    '!*.ts',
    '!**/*.module.ts',
    '!**/*.model.ts',
    '!**/models/*.ts',
    '!**/models/**/*.ts',
    '!**/index.ts',
    '!**/public_api.ts',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/coverage/',
    '<rootDir>/.idea/',
    '<rootDir>/scripts/',
  ],
  testURL: 'http://localhost'
};
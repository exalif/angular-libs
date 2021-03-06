module.exports = {
  setupFilesAfterEnv: ['<rootDir>/setupJest.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: {
        before: [
          'jest-preset-angular/build/StripStylesTransformer',
        ],
      },
    },
  },
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  testEnvironment: 'jest-environment-jsdom-thirteen',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
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
    '@exalif/ngx-breadcrumbs/(.*)': '<rootDir>/dist/ngx-breadcrumbs/$1',
    '@exalif/ngx-test-utils/(.*)': '<rootDir>/dist/ngx-test-utils/$1',
    '@exalif/ngx-file-upload/(.*)': '<rootDir>/dist/ngx-file-upload/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!@ngrx|@ngx-translate)'
  ],
  coverageReporters: ['html', 'text-summary', 'text', 'lcov'],
  collectCoverageFrom: [
    'projects/ngx-breadcrumbs/src/**/*.ts',
    'projects/ngx-test-utils/src/**/*.ts',
    'projects/ngx-file-upload/src/**/*.ts',

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
    '!**/public-api.ts',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/coverage/',
    '<rootDir>/.idea/',
    '<rootDir>/scripts/',
  ],
  testURL: 'http://localhost'
};

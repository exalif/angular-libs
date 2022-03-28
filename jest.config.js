module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setupJest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/ng-snapshot.js',
    'jest-preset-angular/build/serializers/html-comment.js',
    'jest-preset-angular/build/serializers/no-ng-attributes.js',
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
};

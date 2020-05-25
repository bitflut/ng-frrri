module.exports = {
  name: 'ng-integration',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/ng-integration',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};

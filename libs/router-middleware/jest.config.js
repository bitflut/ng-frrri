module.exports = {
  name: 'router-middleware',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/router-middleware',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};

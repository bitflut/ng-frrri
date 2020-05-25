module.exports = {
  name: 'ngxs',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ngxs',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};

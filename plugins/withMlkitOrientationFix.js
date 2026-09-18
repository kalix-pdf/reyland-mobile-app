// plugins/withMlkitOrientationFix.js
const { withAndroidManifest } = require('@expo/config-plugins');

const withMlkitOrientationFix = (config) => {
  return withAndroidManifest(config, (config) => {
    const app = config.modResults.manifest.application[0];
    app.activity = app.activity || [];

    app.activity.push({
      $: {
        'android:name': 'com.google.mlkit.vision.codescanner.internal.GmsBarcodeScanningDelegateActivity',
        'android:exported': 'false',
        'tools:node': 'merge',
        'tools:replace': 'android:screenOrientation',
        'android:screenOrientation': 'unspecified',
      },
    });

    return config;
  });
};

module.exports = withMlkitOrientationFix;
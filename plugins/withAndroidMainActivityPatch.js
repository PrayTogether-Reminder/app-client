const { withMainActivity } = require('@expo/config-plugins');

/**
 * Android MainActivity null check 패치를 적용하는 Config Plugin
 *
 * 문제들:
 * 1. React Native 0.79.5 + ProGuard 활성화 시 다양한 lifecycle 메서드에서
 *    NullPointerException 발생 (ReactActivityDelegate가 null)
 * 2. onCreate에서 super.onCreate(null) 호출로 인한 문제
 * 3. Pixel 4a: onConfigurationChanged에서 crash
 * 4. Galaxy S24 Ultra: onNewIntent, onResume에서 crash
 * 5. Nexus 5X: NoClassDefFoundError, Notification 관련 crash (ProGuard)
 *
 * 해결:
 * 1. super.onCreate(null) → super.onCreate(savedInstanceState) 수정
 * 2. onWindowFocusChanged, onNewIntent, onConfigurationChanged, onResume, onPause에
 *    try-catch 및 null 체크 추가
 * 3. ProGuard 규칙 강화 (proguard-rules.pro)
 */
const withAndroidMainActivityPatch = (config) => {
  return withMainActivity(config, (config) => {
    const { modResults } = config;
    let content = modResults.contents;

    // 이미 패치가 적용되어 있는지 확인
    if (content.includes('// NULL_CHECK_PATCH')) {
      return config;
    }

    // Java 파일인 경우
    if (modResults.language === 'java') {
      // import 추가
      if (!content.includes('import android.view.View;')) {
        content = content.replace(
          /(package .*?;\n)/,
          '$1\nimport android.view.View;'
        );
      }

      if (!content.includes('import android.content.Intent;')) {
        content = content.replace(
          /(package .*?;\n)/,
          '$1\nimport android.content.Intent;'
        );
      }

      // super.onCreate(null) -> super.onCreate(savedInstanceState) 수정
      content = content.replace(
        /super\.onCreate\(null\)/g,
        'super.onCreate(savedInstanceState)'
      );

      // onWindowFocusChanged override 추가
      const onWindowFocusChangedPatch = `
  // NULL_CHECK_PATCH: Fix for Android 10 onWindowFocusChanged crash
  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    try {
      View reactRootView = findViewById(android.R.id.content);
      if (reactRootView != null) {
        super.onWindowFocusChanged(hasFocus);
      }
    } catch (Exception e) {
      // Safely ignore null pointer exceptions in onWindowFocusChanged
      android.util.Log.w("MainActivity", "onWindowFocusChanged error: " + e.getMessage());
    }
  }
`;

      // onNewIntent override 추가
      const onNewIntentPatch = `
  // NULL_CHECK_PATCH: Fix for onNewIntent crash
  @Override
  public void onNewIntent(Intent intent) {
    // Prevent crash when intent is null or React Native bridge is not ready
    if (intent == null) {
      android.util.Log.w("MainActivity", "onNewIntent called with null intent, ignoring");
      return;
    }

    try {
      super.onNewIntent(intent);
    } catch (Exception e) {
      // Catch all exceptions including NullPointerException wrapped in RuntimeException
      android.util.Log.e("MainActivity", "onNewIntent error: " + e.getClass().getSimpleName() + " - " + e.getMessage(), e);
      // Set the intent anyway to prevent further issues
      setIntent(intent);
    }
  }
`;

      // onConfigurationChanged override 추가 (Java)
      const onConfigurationChangedPatchJava = `
  // NULL_CHECK_PATCH: Fix for onConfigurationChanged crash (Pixel 4a issue)
  @Override
  public void onConfigurationChanged(android.content.res.Configuration newConfig) {
    try {
      super.onConfigurationChanged(newConfig);
    } catch (Exception e) {
      // Catch NullPointerException when ReactActivityDelegate is null
      android.util.Log.e("MainActivity", "onConfigurationChanged error: " + e.getClass().getSimpleName() + " - " + e.getMessage(), e);
    }
  }
`;

      // onResume override 추가 (Java)
      const onResumePatchJava = `
  // NULL_CHECK_PATCH: Fix for onResume crash (Galaxy S24 Ultra issue)
  @Override
  public void onResume() {
    try {
      super.onResume();
    } catch (Exception e) {
      // Catch NullPointerException when React Native bridge is not ready
      android.util.Log.e("MainActivity", "onResume error: " + e.getClass().getSimpleName() + " - " + e.getMessage(), e);
    }
  }
`;

      // onPause override 추가 (Java)
      const onPausePatchJava = `
  // NULL_CHECK_PATCH: Fix for onPause crash
  @Override
  public void onPause() {
    try {
      super.onPause();
    } catch (Exception e) {
      android.util.Log.e("MainActivity", "onPause error: " + e.getClass().getSimpleName() + " - " + e.getMessage(), e);
    }
  }
`;

      // 클래스의 끝 부분(마지막 }) 앞에 메서드 추가
      if (!content.includes('onWindowFocusChanged')) {
        content = content.replace(
          /(\n}\s*$)/,
          `${onWindowFocusChangedPatch}$1`
        );
      }

      if (!content.includes('onNewIntent')) {
        content = content.replace(
          /(\n}\s*$)/,
          `${onNewIntentPatch}$1`
        );
      }

      if (!content.includes('onConfigurationChanged')) {
        content = content.replace(
          /(\n}\s*$)/,
          `${onConfigurationChangedPatchJava}$1`
        );
      }

      if (!content.includes('onResume')) {
        content = content.replace(
          /(\n}\s*$)/,
          `${onResumePatchJava}$1`
        );
      }

      if (!content.includes('onPause')) {
        content = content.replace(
          /(\n}\s*$)/,
          `${onPausePatchJava}$1`
        );
      }
    }

    // Kotlin 파일인 경우
    if (modResults.language === 'kt' || modResults.language === 'kotlin') {
      // import 추가
      if (!content.includes('import android.view.View')) {
        // package 선언 다음 줄에 import 추가 (기존 import 섹션에 추가)
        const packageMatch = content.match(/(package .*?\n)(import .*?\n)*/);
        if (packageMatch) {
          const importsEnd = packageMatch[0];
          content = content.replace(
            importsEnd,
            importsEnd + 'import android.view.View\n'
          );
        }
      }

      if (!content.includes('import android.content.Intent')) {
        const packageMatch = content.match(/(package .*?\n)(import .*?\n)*/);
        if (packageMatch) {
          const importsEnd = packageMatch[0];
          content = content.replace(
            importsEnd,
            importsEnd + 'import android.content.Intent\n'
          );
        }
      }

      // super.onCreate(null) -> super.onCreate(savedInstanceState) 수정
      content = content.replace(
        /super\.onCreate\(null\)/g,
        'super.onCreate(savedInstanceState)'
      );

      // onWindowFocusChanged override 추가
      const onWindowFocusChangedPatch = `
  // NULL_CHECK_PATCH: Fix for Android 10 onWindowFocusChanged crash
  override fun onWindowFocusChanged(hasFocus: Boolean) {
    try {
      val reactRootView = findViewById<View>(android.R.id.content)
      if (reactRootView != null) {
        super.onWindowFocusChanged(hasFocus)
      }
    } catch (e: Exception) {
      // Safely ignore null pointer exceptions in onWindowFocusChanged
      android.util.Log.w("MainActivity", "onWindowFocusChanged error: \${e.message}")
    }
  }
`;

      // onNewIntent override 추가
      const onNewIntentPatch = `
  // NULL_CHECK_PATCH: Fix for onNewIntent crash
  override fun onNewIntent(intent: Intent?) {
    // Prevent crash when intent is null or React Native bridge is not ready
    if (intent == null) {
      android.util.Log.w("MainActivity", "onNewIntent called with null intent, ignoring")
      return
    }

    try {
      super.onNewIntent(intent)
    } catch (e: Exception) {
      // Catch all exceptions including NullPointerException wrapped in RuntimeException
      android.util.Log.e("MainActivity", "onNewIntent error: \${e.javaClass.simpleName} - \${e.message}", e)
      // Set the intent anyway to prevent further issues
      setIntent(intent)
    }
  }
`;

      // onConfigurationChanged override 추가
      const onConfigurationChangedPatch = `
  // NULL_CHECK_PATCH: Fix for onConfigurationChanged crash (Pixel 4a issue)
  override fun onConfigurationChanged(newConfig: android.content.res.Configuration) {
    try {
      super.onConfigurationChanged(newConfig)
    } catch (e: Exception) {
      // Catch NullPointerException when ReactActivityDelegate is null
      android.util.Log.e("MainActivity", "onConfigurationChanged error: \${e.javaClass.simpleName} - \${e.message}", e)
    }
  }
`;

      // onResume override 추가
      const onResumePatch = `
  // NULL_CHECK_PATCH: Fix for onResume crash (Galaxy S24 Ultra issue)
  override fun onResume() {
    try {
      super.onResume()
    } catch (e: Exception) {
      // Catch NullPointerException when React Native bridge is not ready
      android.util.Log.e("MainActivity", "onResume error: \${e.javaClass.simpleName} - \${e.message}", e)
    }
  }
`;

      // onPause override 추가
      const onPausePatch = `
  // NULL_CHECK_PATCH: Fix for onPause crash
  override fun onPause() {
    try {
      super.onPause()
    } catch (e: Exception) {
      android.util.Log.e("MainActivity", "onPause error: \${e.javaClass.simpleName} - \${e.message}", e)
    }
  }
`;

      // 클래스의 끝 부분 앞에 메서드 추가
      if (!content.includes('onWindowFocusChanged')) {
        content = content.replace(
          /(\n}\s*$)/,
          `${onWindowFocusChangedPatch}$1`
        );
      }

      if (!content.includes('override fun onNewIntent')) {
        content = content.replace(
          /(\n}\s*$)/,
          `${onNewIntentPatch}$1`
        );
      }

      if (!content.includes('onConfigurationChanged')) {
        content = content.replace(
          /(\n}\s*$)/,
          `${onConfigurationChangedPatch}$1`
        );
      }

      if (!content.includes('override fun onResume')) {
        content = content.replace(
          /(\n}\s*$)/,
          `${onResumePatch}$1`
        );
      }

      if (!content.includes('override fun onPause')) {
        content = content.replace(
          /(\n}\s*$)/,
          `${onPausePatch}$1`
        );
      }
    }

    modResults.contents = content;
    return config;
  });
};

module.exports = withAndroidMainActivityPatch;

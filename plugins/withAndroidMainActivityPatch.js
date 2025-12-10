const { withMainActivity } = require('@expo/config-plugins');

/**
 * Android MainActivity null check 패치를 적용하는 Config Plugin
 *
 * 문제 1: React Native 0.79.5에서 Android 10 기기에서 onWindowFocusChanged 시
 * null pointer exception 발생
 *
 * 문제 2: onCreate에서 super.onCreate(null) 호출로 인해 Activity resume 시
 * ReactActivityDelegate.onNewIntent에서 NullPointerException 발생
 *
 * 해결:
 * 1. MainActivity에서 onWindowFocusChanged를 override하여 null 체크 추가
 * 2. super.onCreate(null)을 super.onCreate(savedInstanceState)로 수정
 * 3. onNewIntent를 override하여 null 체크 추가
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
    try {
      super.onNewIntent(intent);
    } catch (NullPointerException e) {
      // Safely handle null pointer exceptions in onNewIntent
      android.util.Log.w("MainActivity", "onNewIntent error: " + e.getMessage());
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
    try {
      super.onNewIntent(intent)
    } catch (e: NullPointerException) {
      // Safely handle null pointer exceptions in onNewIntent
      android.util.Log.w("MainActivity", "onNewIntent error: \${e.message}")
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
    }

    modResults.contents = content;
    return config;
  });
};

module.exports = withAndroidMainActivityPatch;

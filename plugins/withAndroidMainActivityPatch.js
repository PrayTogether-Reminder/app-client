const { withMainActivity } = require('@expo/config-plugins');

/**
 * Android MainActivity null check 패치를 적용하는 Config Plugin
 *
 * 문제: React Native 0.79.5에서 Android 10 기기에서 onWindowFocusChanged 시
 * null pointer exception 발생
 *
 * 해결: MainActivity에서 onWindowFocusChanged를 override하여 null 체크 추가
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

      // onWindowFocusChanged override 추가
      const patchCode = `
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

      // 클래스의 끝 부분(마지막 }) 앞에 메서드 추가
      content = content.replace(
        /(\n}\s*$)/,
        `${patchCode}$1`
      );
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

      // onWindowFocusChanged override 추가
      const patchCode = `
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

      // 클래스의 끝 부분 앞에 메서드 추가
      content = content.replace(
        /(\n}\s*$)/,
        `${patchCode}$1`
      );
    }

    modResults.contents = content;
    return config;
  });
};

module.exports = withAndroidMainActivityPatch;

const { withAppBuildGradle, withProguardFiles } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * ProGuard 규칙을 자동으로 추가하는 Config Plugin
 *
 * 문제: ProGuard가 앱 빌드 시 필요한 클래스를 삭제해서 앱이 크래시됨
 * 해결: 필요한 클래스를 보호하는 규칙을 자동으로 추가
 */
const PROGUARD_RULES = `
# ============================================================================
# React Native Core
# ============================================================================
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip
-keep,allowobfuscation @interface com.facebook.jni.annotations.DoNotStrip

-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *
-keep @com.facebook.jni.annotations.DoNotStrip class *

-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
    @com.facebook.jni.annotations.DoNotStrip *;
}

-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}

# React Native - Keep all React classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.modules.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-keep class com.facebook.react.views.** { *; }
-keep class com.facebook.react.common.** { *; }
-keep class com.facebook.react.devsupport.** { *; }

# React Native - ReactActivityDelegate and related
-keep class com.facebook.react.ReactActivityDelegate { *; }
-keep class com.facebook.react.ReactActivity { *; }
-keep class com.facebook.react.ReactRootView { *; }
-keep class com.facebook.react.ReactInstanceManager { *; }

# React Native - Prevent inner class obfuscation
-keepattributes InnerClasses
-keepattributes Signature
-keepattributes Exceptions
-keepattributes *Annotation*
-keepattributes EnclosingMethod

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# ============================================================================
# Expo Modules
# ============================================================================
-keep class expo.modules.** { *; }
-keep class expo.modules.splashscreen.** { *; }
-keep class expo.modules.updates.** { *; }
-keep class expo.modules.notifications.** { *; }
-keep class expo.modules.notifications.service.** { *; }
-keep class expo.modules.ReactActivityDelegateWrapper { *; }

# Expo Notifications - Critical for Nexus 5X notification crash
-keep class expo.modules.notifications.notifications.** { *; }
-keep class expo.modules.notifications.service.NotificationsService { *; }
-keep class expo.modules.notifications.service.NotificationForwarderActivity { *; }
-keepclassmembers class expo.modules.notifications.service.NotificationsService$Companion {
    public <methods>;
}

# ============================================================================
# Firebase
# ============================================================================
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# Firebase Messaging
-keep class com.google.firebase.messaging.** { *; }
-keep class com.google.firebase.iid.** { *; }

# Firebase Crashlytics
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
-keep class com.google.firebase.crashlytics.** { *; }
-dontwarn com.google.firebase.crashlytics.**

# ============================================================================
# React Native Reanimated
# ============================================================================
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# ============================================================================
# React Navigation
# ============================================================================
-keep class com.th3rdwave.safeareacontext.** { *; }
-keep class com.swmansion.rnscreens.** { *; }

# ============================================================================
# Other Libraries
# ============================================================================
# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# Retrofit/Gson (if used)
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# ============================================================================
# Application Specific
# ============================================================================
# Keep your main application class
-keep class site.praytogether.MainApplication { *; }
-keep class site.praytogether.MainActivity { *; }
`;

const withProguardRules = (config) => {
  return withAppBuildGradle(config, (config) => {
    // proguard-rules.pro 파일 경로
    const projectRoot = config.modRequest.projectRoot;
    const proguardRulesPath = path.join(
      projectRoot,
      'android',
      'app',
      'proguard-rules.pro'
    );

    // android 폴더가 존재하는 경우에만 실행 (prebuild 후)
    if (fs.existsSync(proguardRulesPath)) {
      let existingRules = fs.readFileSync(proguardRulesPath, 'utf8');

      // 이미 추가된 경우 스킵
      if (!existingRules.includes('# React Native Core')) {
        // 기존 내용 유지하면서 새 규칙 추가
        const updatedRules = existingRules + '\n' + PROGUARD_RULES;
        fs.writeFileSync(proguardRulesPath, updatedRules, 'utf8');
        console.log('✅ ProGuard rules added successfully');
      } else {
        console.log('✅ ProGuard rules already exist');
      }
    }

    return config;
  });
};

module.exports = withProguardRules;

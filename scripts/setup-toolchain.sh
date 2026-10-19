#!/usr/bin/env bash
set -e

echo "[Setup Toolchain] Ensuring all Android compilers and SDKs are installed..."

mkdir -p /opt/android-sdk/platforms/android-33 /opt/android-sdk/build-tools/33.0.0

# 1. Android Platform JAR
if [ ! -f /opt/android-sdk/platforms/android-33/android.jar ]; then
  echo "[Setup] Fetching Android 33 platform jar..."
  curl -fsSL https://raw.githubusercontent.com/Sable/android-platforms/master/android-33/android.jar -o /opt/android-sdk/platforms/android-33/android.jar || \
  curl -fsSL https://github.com/skylot/jadx/raw/master/jadx-core/src/test/resources/android/android-30.jar -o /opt/android-sdk/platforms/android-33/android.jar
fi

# 2. Google D8 Dex compiler
if [ ! -f /opt/android-sdk/build-tools/33.0.0/d8.jar ]; then
  echo "[Setup] Fetching Google D8 jar..."
  curl -fsSL https://dl.google.com/dl/android/maven2/com/android/tools/r8/3.3.28/r8-3.3.28.jar -o /opt/android-sdk/build-tools/33.0.0/d8.jar
fi

# 3. Kotlin compiler
if [ ! -f /opt/kotlinc/bin/kotlinc ]; then
  echo "[Setup] Fetching Kotlin compiler 1.9.22..."
  curl -fsSL https://github.com/JetBrains/kotlin/releases/download/v1.9.22/kotlin-compiler-1.9.22.zip -o /tmp/kotlinc.zip
  unzip -q /tmp/kotlinc.zip -d /opt
  rm -f /tmp/kotlinc.zip
  ln -sf /opt/kotlinc/bin/kotlinc /usr/local/bin/kotlinc
fi

# 4. Gradle 8.5
if [ ! -f /opt/gradle-8.5/bin/gradle ]; then
  echo "[Setup] Fetching Gradle 8.5..."
  curl -fsSL https://services.gradle.org/distributions/gradle-8.5-bin.zip -o /tmp/gradle.zip
  unzip -q /tmp/gradle.zip -d /opt
  rm -f /tmp/gradle.zip
  ln -sf /opt/gradle-8.5/bin/gradle /usr/local/bin/gradle
fi

# 5. Debug Keystore
if [ ! -f /opt/android-sdk/debug.keystore ]; then
  echo "[Setup] Generating standard Android debug.keystore..."
  keytool -genkey -v -keystore /opt/android-sdk/debug.keystore \
    -storepass android -alias androiddebugkey -keypass android \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -dname "CN=Android Debug,O=Android,C=US"
fi

echo "[Setup Toolchain] Complete!"

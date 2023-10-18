cordova run browser

#apt install default-jdk
#apt install default-jre
#apt install android-sdk

export JAVA_HOME=/usr/lib/jvm/java-1.17.0-openjdk-amd64/
export ANDROID_HOME=/usr/lib/android-sdk/
export ANDROID_SDK_ROOT=/usr/lib/android-sdk/
export PATH=${PATH}:${ANDROID_HOME}/tools
export PATH=${PATH}:${ANDROID_HOME}/platform-tools

export PATH=/usr/local/bin:$PATH
export PATH=/usr/local/bin:$PATH
export PATH=/usr/lib/android-sdk//tools:$PATH

# manuel laden und entpacken::::: https://developer.android.com/tools/sdkmanager

cordova build android

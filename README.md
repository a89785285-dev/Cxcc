# BLOCK MASTER

BLOCK MASTER is moving from the Capacitor wrapper to a native Android application built with Kotlin and Android Canvas.

## Build the Android APK with GitHub

1. Open the repository's **Actions** tab.
2. Select **Build Native Android APK** on branch `migration/native-android-kotlin`.
3. Run the workflow and wait for it to finish.
4. Open the successful run and download **BLOCK-MASTER-NATIVE-APK** from Artifacts.
5. Extract and install `app-debug.apk` on an Android device.

## Technology

- Native Android: Kotlin + Android Canvas.
- No Capacitor and no WebView in the new Android app.
- The original web/PWA source remains in the repository separately.
- The native app implements the 8×8 board, three pieces per round, touch dragging, scoring, row/column clearing, and local best-score storage.

## Status

This is the first native migration pass. The GitHub Actions build and real-device gameplay/performance tests must pass before the migration is considered complete.

# Inventory Management System - Mobile App

This directory contains the mobile application package (`.apk` file) and instructions for the **Inventory Management System**.

---

## 📱 App Artifacts

- **App Package**: [`app-debug.apk`](./app-debug.apk) (approx. 5.0 MB)
- **Target Platform**: Android (min SDK 22, target SDK 34/35)
- **API Backend Endpoint**: `https://ims-backend-7c60.onrender.com`

---

## 🚀 Installation & Running Guide

### Step 1: Copy the APK to your Android Device
You can copy the [`app-debug.apk`](./app-debug.apk) file to your phone in one of the following ways:
- **Google Drive**: Upload the `.apk` file to Google Drive on your computer and open the Drive app on your phone.
- **USB Connection**: Connect your phone to your computer via USB and copy the `.apk` file directly to your phone's storage.
- **Chat/Email**: Send the file to yourself via an email or a messaging client (e.g. WhatsApp, Slack, Telegram).

### Step 2: Install the APK on your Phone
1. Open your phone's file manager and locate the transferred `app-debug.apk`.
2. Tap on the file.
3. If prompted, allow installations from **Unknown Sources** or select **"Install anyway"** (this warning appears for all custom `.apk` files not downloaded from the Google Play Store).
4. Wait for the installation to finish.

### Step 3: Run the App
- Find the **Inventory Management System** app icon on your launcher and tap it to launch!
- The app will connect directly to your live backend server at `https://ims-backend-7c60.onrender.com`.

---

## 🛠️ Developer Guide (How to Rebuild or Run Development Mode)

If you modify the React+Vite frontend and want to generate a new `.apk` file:

### 1. Build and Sync the App
Run this in the `frontend/` directory to rebuild the production build and copy it to the Android asset package:
```bash
cd frontend
VITE_API_URL=https://ims-backend-7c60.onrender.com npm run build
npx cap sync
```

### 2. Compile a New APK File
Run this inside the `frontend/android` directory:
```bash
cd frontend/android
./gradlew assembleDebug
```
The new `.apk` will be generated at `frontend/android/app/build/outputs/apk/debug/app-debug.apk`.

### 3. Move it to the Mobile Folder
You can copy the new file to the `mobile` folder:
```bash
cp frontend/android/app/build/outputs/apk/debug/app-debug.apk mobile/app-debug.apk
```

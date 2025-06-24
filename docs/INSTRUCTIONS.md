# 🚀 Food & Mood - Quick Start & Troubleshooting Guide

This guide provides instructions for setting up and running the Food & Mood application, along with solutions to common issues you might encounter during development.

---

## 🛠 Tech Stack

-   **Framework:** React Native
-   **Platform:** Expo
-   **Language:** JavaScript

---

## 🏁 Getting Started

### Prerequisites

1.  **Node.js:** Ensure you have Node.js (LTS version recommended) installed.
2.  **Expo Go App:** For testing on a physical device, install the "Expo Go" app from the App Store or Google Play Store.
3.  **Xcode (macOS only):** For testing on the iOS Simulator, ensure you have Xcode installed from the Mac App Store.

### 1. Install Dependencies

If you're setting up the project for the first time, open your terminal in the project root and run:

```bash
npm install
```

This will install all the required packages based on the `package.json` file.

### 2. Start the Development Server

To start the app, run the following command:

```bash
npx expo start
```

This will start the Metro Bundler and provide you with a QR code and command-line options to preview the app.

---

## 📱 Previewing the App

Once the server is running, you can:

-   **On your Phone:** Open the Expo Go app and scan the QR code from your terminal.
-   **On the iOS Simulator:** Press `i` in the terminal.
-   **In a Web Browser:** Press `w` in the terminal.

Any changes you make to the code will now reload the app automatically. Logs will appear in the terminal window where the server is running.

---

## 🩺 Troubleshooting

If you encounter issues, follow these steps in order.

### Problem 1: The server hangs or fails to start.

-   **Symptom:** The `npx expo start` command doesn't show the QR code or seems stuck.
-   **Solution:** Stop the server (`Ctrl+C`) and run it again with the `--clear` flag to reset the cache.

    ```bash
    npx expo start --clear
    ```

### Problem 2: iOS Simulator fails to launch.

-   **Symptom:** You see an error containing `xcrun simctl` or `Unable to boot device`.
-   **Solution:** This indicates an issue with Xcode's command-line tools or the simulator itself.

    1.  **Reset Xcode Tools Path:** Run this command to ensure the path is correct. You may be prompted for your password.
        ```bash
        sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
        ```

    2.  **Restart Simulators:** Shut down any running or hung simulator instances.
        ```bash
        xcrun simctl shutdown all
        ```

    3.  Restart the development server (`npx expo start`) and try opening the simulator again (`i`).

### Problem 3: App crashes on launch with "Incompatible React versions" error.

-   **Symptom:** The app opens on your phone or simulator but immediately crashes, and the terminal shows an error about `react` and `react-native-renderer` versions not matching.
-   **Solution:** This happens if `react` or `react-dom` have been updated to a version that is out of sync with your project's Expo SDK version.

    1.  Stop the server (`Ctrl+C`).
    2.  Check your `package.json` to see the `react` version specified under `dependencies`. It should match what Expo expects (e.g., `"react": "19.0.0"`).
    3.  Re-install the correct versions. For this project, it is `19.0.0`.
        ```bash
        npm install react@19.0.0 react-dom@19.0.0
        ```
    4.  Restart the server: `npx expo start --clear`. 
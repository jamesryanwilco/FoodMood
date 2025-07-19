# App Deployment and Submission Guide

This document outlines the journey and the steps required to take the app from a simple Expo Go project to a production build ready for the Apple App Store.

---

## 1. From Expo Go to Development Builds

The app was initially developed and tested using **Expo Go**, a pre-built app that allows for rapid development without needing to compile native code.

The moment we decided to add a feature that required custom native code (like Firebase Analytics), we had to move away from Expo Go. This is because Expo Go only includes a standard set of native libraries, and any new ones require us to create our own custom version of the app.

This custom version is called a **Development Build**.

---

## 2. The Development Build Workflow

The modern Expo workflow for apps with custom native code involves two main commands:

1.  `eas build --profile development-simulator --platform ios`: This command uses the **EAS (Expo Application Services) Build** cloud service to compile a special version of your app that can run on the iOS Simulator. You only need to do this once, or whenever you change the native code (e.g., add or remove a library).

2.  `npx expo start`: This command starts the local development server. You can then press `i` to open your app on the simulator. The server will look for the **Development Build** you installed and load your JavaScript code into it. This allows for the fast refresh and live reloading you are used to.

---

## 3. Common Hurdles and Solutions

The journey to a successful build involved several challenges. This section documents them for future reference.




###  Mismatched Build Types (Device vs. Simulator)

*   **Problem:** A build created with `"distribution": "internal"` or the `production` profile produces an `.ipa` file meant only for physical iPhones. Attempting to install this on the simulator results in a `Failed to find matching arch` error.
*   **Solution:** To create a build that runs on the simulator, a separate build profile is needed in `eas.json` with the `ios.simulator` flag set to `true`.

    ```json
    "development-simulator": {
      "developmentClient": true,
      "ios": {
        "simulator": true
      }
    }
    ```
    You must then explicitly use this profile when building: `eas build --profile development-simulator`.

---

## 4. Final App Store Submission Workflow

Once all development and testing is complete, the final process is:

1.  **Create a Production Build:** Run `eas build --profile production --platform ios`. This creates the final, optimized `.ipa` file.
2.  **Create the App Record:** In [App Store Connect](https://appstoreconnect.apple.com/), create a new app record. The **Bundle ID** must exactly match the `bundleIdentifier` in your `app.json`. The app name can be changed later.
3.  **Upload the Build:** Use Apple's **Transporter** app on your Mac to upload the `.ipa` file from Step 1.
4.  **Take Screenshots:** Use the simulator build (`.app` file) to run the app on various simulator devices and take screenshots (`Cmd + S`).
5.  **Complete the Listing:** Fill out all required metadata on App Store Connect (description, keywords, privacy policy, etc.) and upload your screenshots.
6.  **Submit:** Once the uploaded build has finished processing, select it and submit the app for review. 
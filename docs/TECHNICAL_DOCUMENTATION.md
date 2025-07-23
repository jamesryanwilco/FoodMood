# 🛠️ Technical Documentation

This document provides a technical overview of the Food & Mood application's architecture and implementation.

---

## 1. Project Structure

The `src` directory is organized to separate concerns and improve maintainability:

-   **/src/screens**: Contains all main screen components, organized by feature (e.g., `checkin`, `onboarding`, `GoalsScreen.js`, `InsightsScreen.js`).
-   **/src/navigation**: Manages all React Navigation logic. `AppNavigator.js` is the main stack navigator, while `MainTabNavigator.js` handles the primary tabbed interface for "Check In," "Entries," "Insights," "Guide," and "Goals."
-   **/src/components**: Stores reusable UI components (e.g., `StyledSegmentedControl.js`).
-   **/src/context**: Manages global state for the check-in flow via `CheckInContext.js`.
-   **/src/services**: Houses logic for device features.
-   **/src/data**: Stores static data, such as the `emotions.js` matrix.

---

## 2. State Management

-   **React Context (`CheckInContext.js`)**: The application uses React's Context API to manage the state of a meal entry as it's being created. This allows data to be passed through the component tree without prop drilling.
    -   The `CheckInProvider` wraps the main `AppNavigator`, making the `checkInData` object and its updater functions available to all screens in the check-in flow.
    -   State is reset via `resetCheckInData()` after a check-in is successfully saved.

---

## 3. Navigation

-   **React Navigation**: The app uses `@react-navigation/stack` for overall navigation and `@react-navigation/bottom-tabs` for the main interface.
    -   **`AppNavigator.js`**: A primary `StackNavigator` that manages the transition between the initial `WelcomeScreen`, the `Onboarding` flow, and the `MainTabNavigator`. The check-in screens are also part of this main stack to allow them to be presented modally over the tab bar.
    -   **`MainTabNavigator.js`**: A `BottomTabNavigator` that provides access to the core features: "Check In," "Entries," "Insights," "Guide," and "Goals."

---

## 4. Local Data Storage

-   **`@react-native-async-storage/async-storage`**: All user-generated content is stored locally on the device.
    -   Meal entries are saved as a single JSON array under the key `pending_entries`. An entry's `status` field is updated from `'pending'` to `'completed'` upon completion. The completed entry now also includes `emotionsAfter`, `fullness`, `mindfulness`, and `eatingSpeed` properties.
    -   User intentions are saved as a JSON object under the key `user_goals`, containing `selected` and `custom` goal properties.
    -   The `EntriesScreen` fetches and parses the `pending_entries` data for display. It also contains the logic to modify a completed entry via a modal and save the changes back to AsyncStorage.
    -   The `InsightsScreen` fetches and analyzes the `pending_entries` data to calculate and display all statistics and charts.
        -   It now correctly uses the user-provided `date` property for all date-sensitive calculations (streak, filtering) instead of the entry creation timestamp.
        -   It generates three interactive line plots: Energy, Hunger/Fullness, and How You Eat.
    -   The `GoalsScreen` fetches and updates the `user_goals` data.

---

## 5. Notifications & Timers

-   **`expo-notifications`**: The app uses this library to schedule and handle local notifications for meal reminders.
    -   **Permissions**: On app startup, `App.js` requests notification permissions from the user. This is handled in the root component to ensure permissions are ready when needed.
    -   **Scheduling**: In `Step5_ReminderScreen.js`, a notification is scheduled locally after the user completes Phase 1 of a check-in. The trigger time is based on the number of minutes the user inputs. The `entryId` is passed in the notification's `data` payload.
    -   **Handling**: `App.js` contains a listener (`addNotificationResponseReceivedListener`) that waits for a user to tap on a notification. When an interaction is detected, it uses the `entryId` from the payload to navigate the user directly to the "Complete Meal" flow (`CompleteStep1`).
-   **Live Timers**:
    -   In `EntriesScreen.js`, a `useEffect` hook runs an interval timer that updates every second.
    -   It calculates the time remaining for each pending entry by comparing the current time with the scheduled completion time (`phase1_completed_at` + `reminder_minutes`).
    -   The remaining time is stored in a state variable and displayed in the `renderPendingItem` component, providing a live countdown.

---

## 6. Key Dependencies

-   `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`: Core navigation libraries.
-   `@react-native-async-storage/async-storage`: For persistent local storage.
-   `expo-notifications`, `expo-device`: For scheduling and handling local reminders.
-   `date-fns`: For robust date manipulation, used for grouping entries by week and for filtering insights by date ranges.
-   `react-native-chart-kit`: For rendering the pie chart and all line plots on the Insights screen. Custom styling is used for line fills.
-   `react-native-heroicons`, `react-native-svg`: For high-quality, consistent iconography.
-   `@react-native-community/slider`: For the sliders used in the check-in process.
-   `@react-native-segmented-control/segmented-control`: For the "Pending/Completed" tabs on the Entries screen and the date filter on the Insights screen.
-   `uuid`, `react-native-get-random-values`: For generating unique IDs for each entry. 

### Settings & Notifications
- `SettingsScreen.js`: A new screen providing users with options to manage their preferences. It features a dark mode theme and includes toggles for notification permissions and general reminders.
- `NotificationService.js`: Enhanced to support daily, repeating general reminders. It includes logic to schedule a notification at noon and includes the user's current streak in the message.
- `streakUtils.js`: A new utility to centralize the streak calculation logic, which is now used by both the `InsightsScreen` and the `NotificationService`.

### Interactive Mood Meter
The `MoodMeterGrid.js` component has been significantly refactored to create a more interactive and intuitive user experience.

- **Gesture Handling**: The component now uses the `GestureDetector` API from `react-native-gesture-handler` to manage user interactions. It combines a `PinchGesture` for zooming and a `TapGesture` (implemented via `Pressable`) for selection.
- **Assisted Zoom**: The zoom is now "assisted," meaning it automatically centers on the currently selected emotion.
  - The `useEffect` hook tracks changes to the `selectedValue` prop.
  - When the selection changes, it calculates the target coordinates and uses `withTiming` to smoothly animate the grid's position.
- **Conditional Panning**: The centering translation is only applied when the grid is zoomed in (`scale > 1`). An `interpolate` function is used to create a smooth transition as the user starts and ends their zoom.
- **Cell Selection**: The grid cells are now `Pressable` components. The `onCellPress` callback is passed up to the parent screen, which then updates the slider values.
- **Optimized Selection Style**: The `transform` property on the selected cell has been replaced with a thicker border and a larger font size to provide a clean, crisp selection effect without any rendering glitches. 
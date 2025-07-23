# 💾 Data Storage Guide

This document provides a complete reference for all data stored in the user's local device via **AsyncStorage**.

---

## 1. Primary Data Key: `pending_entries`

All user-generated check-in data is stored under a single key in AsyncStorage: `pending_entries`. This key holds a stringified JSON array of "entry" objects. Each object represents a single meal check-in.

### The Entry Object Structure

Below is the complete structure of a single entry object, detailing each property, where it is set, and where it is used.

| Property | Type | Set In | Description | Used In |
| :--- | :--- | :--- | :--- | :--- |
| **`id`** | `String` | `Step5_ReminderScreen.js` | A unique UUIDv4 generated when the first phase of the check-in is saved as "pending". | **Entries:** Key for lists & updates.<br>**Phase 2 Screens:** Identifies the entry to update. |
| **`status`** | `String` | `Step5_ReminderScreen.js` ('pending'), `CheckInContext.js` ('completed') | The current state of the entry. | **Entries:** Filters between Pending/Completed lists.<br>**Insights:** Filters for completed entries only. |
| | | | | |
| **Phase 1 Data** | | | *(Collected before the meal)* | |
| **`date`** | `String` | `Step1_BasicInfoScreen.js` | The ISO string of the date and time the user is logging. | **Entries:** Display and editing.<br>**Insights:** Used for streak calculation and date range filtering. |
| **`mealType`** | `String` | `Step1_BasicInfoScreen.js` | e.g., "Breakfast", "Lunch", "Dinner", "Snack". | **Entries:** Display and editing.<br>**Insights:** Displayed in modals. |
| **`foodDescription`** | `String` | `Step1_BasicInfoScreen.js` | The user's description of the meal. | **Entries:** Display and editing.<br>**Insights:** Used to identify "Top Energy Boost" meals. |
| **`emotions`** | `Array<String>` | `Step2_EmotionScreen.js` / `Step2a_MoodMeterScreen.js` | The user's selected emotions before eating. | **Entries:** "Before" mood display.<br>**Insights:** "Before" value for "Common Mood Shifts" analysis. |
| **`energyLevel`** | `Number` | `Step3_PhysicalStateScreen.js` | The user's energy level (0-10) before eating. | **Entries:** "Before" energy display.<br>**Insights:** "Before" value for "Avg. Energy Boost" & energy line chart. |
| **`hungerLevel`** | `Number` | `Step3_PhysicalStateScreen.js` | The user's hunger level (0-10) before eating. | **Insights:** "Before" value for the hunger/fullness line chart. |
| **`motivations`** | `Array<String>` | `Step4_MotivationsScreen.js` | The user's selected reasons for eating. | **Entries:** Displays as tags.<br>**Insights:** Powers the "Eating Motivations" pie chart. |
| **`notes`** | `String` | `Step4_MotivationsScreen.js` | The user's free-text notes before eating. | *(Not currently used in UI)* |
| **`phase1_completed_at`**| `String` | `Step5_ReminderScreen.js` | The ISO string of when the user finished Phase 1. | **Entries:** Sorting pending entries. |
| **`reminder_minutes`**| `Number` | `Step5_ReminderScreen.js` | The number of minutes for the reminder notification. | **Entries:** Countdown timer for pending entries. |
| | | | | |
| **Phase 2 Data** | | | *(Collected after the meal)* | |
| **`mindfulness`** | `Number` | `Phase2_Step1_ExperienceScreen.js` | User's mindfulness level (0-10) during the meal. | **Insights:** Used in the "How You Eat" line chart. |
| **`eatingSpeed`** | `Number` | `Phase2_Step1_ExperienceScreen.js` | User's eating speed (0-10) during the meal. | **Insights:** Used in the "How You Eat" line chart. |
| **`energy`** | `Number` | `Phase2_Step1_ExperienceScreen.js` | User's energy level (0-10) **after** the meal. | **Entries:** "After" energy display.<br>**Insights:** "After" value for "Avg. Energy Boost" & energy line chart. |
| **`fullness`** | `Number` | `Phase2_Step1_ExperienceScreen.js` | User's fullness level (0-10) after the meal. | **Insights:** "After" value for the hunger/fullness line chart. |
| **`emotionsAfter`** | `Array<String>` | `Phase2_Step1a_EmotionScreen.js` / `Phase2_Step1ba_MoodMeterScreen.js` | The user's selected emotions **after** eating. | **Entries:** "After" mood display.<br>**Insights:** "After" value for "Common Mood Shifts" analysis. |
| **`goalAligned`** | `Boolean` | `Phase2_Step2_GoalScreen.js` | Whether the user felt the meal aligned with their goals. | *(Not currently used in UI)* |
| **`phase2_completed_at`**| `String` | `CheckInContext.js` (in `completeCheckIn`) | The ISO string of when the user finished the entire entry. | **Entries:** Sorting and grouping completed entries by week. |

---

## 2. Other Data Keys

| Key | Set In | Description |
| :--- | :--- | :--- |
| **`hasOnboarded`** | `OnboardingScreen.js` | A simple boolean flag (`'true'`) set after the user completes the initial onboarding flow. Used in `App.js` to determine the initial route. |
| **`userId`** | `OnboardingScreen.js` | A UUIDv4 generated for analytics purposes to anonymously identify the user. Sent to Segment. |
| **`goals`** | `SelectGoalsScreen.js` / `GoalsScreen.js` | A stringified JSON array of the user's selected long-term goals. | 
# 🚧 Food & Mood Features

This document tracks the development status of the app's core features.

## ✅ Completed

-   **Onboarding Flow:** A multi-page introduction to mindful eating and how the app works, with swipe and button navigation.
-   **Basic UI Structure:** Welcome screen, onboarding, and main tab navigation are in place.
-   **Main App UI Shell:** Placeholder screens for Check-in, Analyze, and Guide are set up with a tab bar.
-   **Full Check-In Flow (Phase 1 & 2):**
    -   [✅] **Before-Eating Check-In:** Log meal info, emotions, physical state, and motivations (including "Energy" and "Performance").
    -   [✅] **After-Eating Check-In:** Log post-meal emotions, experience, and goal fulfillment.
-   **Entry Management & Display:**
    -   [✅] View pending entries.
    -   [✅] View completed entries grouped by week and sorted from latest to oldest.
    -   [✅] Display meal-type icons, eating motivations, and before/after comparisons for mood and energy.
    -   [✅] Delete entries (pending or completed) with a confirmation prompt.
    -   [✅] Modify completed entries (date, meal type, description) via an in-place modal.
-   **Reminders & Timers:**
    -   [✅] **Notification Reminders:** Users are prompted to set a reminder (in minutes) after completing a "before eating" entry. A local notification is scheduled to remind them to complete the second part.
    -   [✅] **Live Countdown:** The "Pending" entries list displays a live countdown for each entry, showing the time remaining until the reminder is due.
-   **Emotion Matrix:** A guided tool for users to identify and log their emotional state (used for both pre-meal and post-meal).
-   **Goals Screen ("Goals" Tab):**
    -   [✅] Users can select from predefined intentions or write their own.
    -   [✅] Goals are saved and reloaded when returning to the screen.
-   **Insights Dashboard ("Insights" Tab):**
    -   [✅] **Interactive Analytics:**
        -   Display total entries, average energy boost, and top 3 energy-boosting meals.
        -   Display an accurate daily streak counter based on the user-assigned date of the meal.
        -   Filter all insights by "This Week" (default), "This Month," or "All Time."
    -   [✅] **Eating Motivation Chart:** A pie chart visualizing the breakdown of eating motivations.
    -   [✅] **Interactive Mood Shift List:**
        -   Displays the top 3 most common mood transitions (e.g., "Stressed → Calm").
        -   Tapping a shift opens a modal showing all associated foods, categorized by meal type (Breakfast, Lunch, etc.).
    -   [✅] **Interactive Data Plots:**
        -   All plots feature a semi-transparent fill under the primary line for better readability.
        -   **Energy Plot:** Dual-line chart for "Energy Before" vs. "Energy After."
        -   **Hunger & Fullness Plot:** Dual-line chart for "Hunger Before" vs. "Fullness After."
        -   **How You Eat Plot:** Dual-line chart for "Mindfulness" vs. "Eating Speed."
-   **UI & Animations:**
    -   [✅] Added a continuous, smooth spinning animation to the main Check-In wheel.
    -   [✅] Refined UI layouts for better alignment and visual appeal across multiple screens.
    -   [✅] Implemented a reusable, styled segmented control for consistent UI across the app.

## 🏃‍♀️ In Progress

-   **Advanced Insights:**
    -   [ ] Visualizations (charts, graphs) showing patterns between food, mood, and energy over time.
    -   [ ] Pie chart or bar graph of eating motivations.

## 📝 Planned

### Core Functionality
-   **Meal History:** A searchable/filterable log of all past check-ins.

### Content & Support ("Guide" Tab)
-   **Educational Articles:**
    -   [ ] "What is Mindful Eating?"
    -   [ ] "Understanding Your Hunger Cues"
    -   [ ] "Tips for Slowing Down"
-   **Guided Meditations:** Short audio guides for mindful eating.

### Settings & Personalization
-   **User Profile & Intentions:** Allow users to set or update their primary intention/goal.
-   **Data Export:** Option for users to export their data. 
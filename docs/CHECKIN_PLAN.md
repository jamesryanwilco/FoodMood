# Check-In & Entry System Plan

This document outlines the design and flow for the two-phase meal entry system.

---

## 🎯 Two-Phase Entry System

The app uses a unique two-phase approach that separates reflection before eating from completion after eating.

### Phase 1: Before Eating (5 Steps)

**Step 1: Basic Information (✅ Complete)**
-   Date and time selection (defaults to current time).
-   Meal type selection (breakfast, lunch, dinner, snack) with custom imagery.
-   Food description in a free-text field.

**Step 2: Emotion Discovery (✅ Complete)**
-   Interactive 27-cell emotion matrix with body-centered categorization.
-   Two modes: guided discovery vs. quick selection.
-   Users can select multiple emotions from categories like tense, relaxed, or not sure.

**Step 3: Physical State (✅ Complete)**
-   Energy level assessment (1-10 scale with battery indicator).
-   Hunger level assessment (1-10 scale with gas meter indicator).
-   Large, centered visual gauges with gradient effects.

**Step 4: Eating Motivations (✅ Complete)**
-   Selection of reasons for eating (hunger, stress, celebration, etc.).
-   Multiple selection is allowed.
-   Optional notes for context.

**Step 5: Set Reminder (✅ Complete)**
-   User sets the number of minutes to wait before receiving a reminder.
-   This triggers the notification scheduling.

---

### ⏳ Between Phases: Smart Timing (✅ Complete)

After completing Phase 1, the app:
1.  Creates a "pending entry" stored locally.
2.  Calculates the expected meal completion time based on user input.
3.  Schedules notifications to remind the user to complete the entry.
4.  Shows live countdown timers on the "Pending" tab of the entries screen.

---

### Phase 2: After Eating (3 Steps)

**Step 1: Eating Experience (✅ Complete)**
-   Mindfulness rating (how present the user was).
-   Eating speed assessment.
-   Large visual indicators for energy and fullness levels.

**Step 2: Emotion Reflection (✅ Complete)**
-   Users select their post-meal emotions using the same guided or quick-select matrix.

**Step 3: Goal Assessment (✅ Complete)**
-   Whether eating fulfilled the original reason (yes/partly/no).
-   Optional notes if it didn't fully satisfy.
-   Completion saves the full entry to the user's history.

---

## 🗺️ Navigation Flow (✅ Complete)

The entry system has two main sections:
-   **"Start New Meal"**: Begins Phase 1.
-   **"My Entries"**: This screen has two tabs:
    -   **Pending**: Shows incomplete entries with live countdown timers and a "Complete" button.
    -   **Completed**: Shows a filterable history of all completed meal entries.

## 💾 Data Storage (✅ Complete)

All entries are stored locally. Old pending entries are automatically cleaned up after 24 hours. The system includes comprehensive error handling for storage issues.

This design promotes mindful eating by separating the intention-setting phase from the reflection phase, encouraging users to think about their relationship with food both before and after meals. 
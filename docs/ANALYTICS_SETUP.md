# 📈 Analytics Integration Guide

This document outlines the analytics setup implemented in the FoodMood app using Segment.

## 1. Overview

To provide flexible and powerful analytics without tightly coupling the app to a single service like Google Analytics, we've integrated **Segment**. Segment acts as a central hub for collecting user data. You write tracking code once, and then you can send that data to hundreds of tools (including Google Analytics, Mixpanel, etc.) by flipping a switch in the Segment web dashboard—no new app releases required.

## 2. Core Components

The analytics integration consists of two main parts:

-   **Segment SDK (`@segment/analytics-react-native`)**: The official library for sending data to Segment from a React Native application.
-   **Analytics Service (`src/services/AnalyticsService.js`)**: A custom module created to centralize all analytics-related code. This service wraps the Segment SDK and provides simple, reusable functions for tracking events, identifying users, and tracking screen views.

## 3. How It Works

### Initialization

-   Segment is initialized once when the app first launches in **`App.js`**.
-   The configuration, including your **Segment Write Key**, is managed in `src/services/AnalyticsService.js`. The `trackAppLifecycleEvents: true` option is enabled to automatically capture key events like "Application Opened," "Application Installed," and "Application Updated."

### Automatic Screen Tracking

-   To automatically track every screen a user visits, the `<NavigationContainer>` in **`App.js`** is monitored.
-   The `onStateChange` event fires whenever the user navigates, and the `analyticsScreen()` function is called with the new screen's name.

### Custom Event Tracking

We have implemented tracking for key user actions to provide insight into feature engagement:

1.  **`Check-In Started`**
    -   **File**: `src/screens/CheckInScreen.js`
    -   **Trigger**: Fired when a user presses the button to start a new meal check-in.

2.  **`Check-In Completed`**
    -   **File**: `src/screens/checkin/Phase2_Step2_GoalScreen.js`
    -   **Trigger**: Fired when a user successfully completes the final step of a post-meal reflection.
    -   **Properties**: Includes the `entryId` to link the event to a specific meal.

### User Identification

-   **File**: `src/screens/onboarding/OnboardingScreen.js`
-   **Trigger**: A unique, anonymous user ID is generated and sent to Segment via an `identify()` call when a user completes the onboarding flow.
-   This ensures that all subsequent events are tied to the same user profile, allowing you to analyze user journeys over time.

## 4. How to Use and Extend

-   **Adding New Events**: To track a new event, import the `trackEvent` function from the analytics service and call it:
    ```javascript
    import { trackEvent } from '../services/AnalyticsService';

    // ... later in your component
    trackEvent('Your Event Name', { customProperty: 'value' });
    ```
-   **Viewing Data**: Log in to your Segment account to see a live stream of events in the "Debugger" tab. From the "Destinations" tab, you can connect your Segment source to Google Analytics or other tools to begin analysis. 
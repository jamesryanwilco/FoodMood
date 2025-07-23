# 📈 Analytics Integration Guide

This document outlines the analytics setup implemented in the Awara app using Segment, with Mixpanel as the primary analytics destination.

## 1. Overview

To provide flexible and powerful analytics, we use **Segment** as a central hub (Customer Data Platform). The app sends tracking data once to Segment's servers. From there, we can control where the data is sent without needing to release new app versions.

Our primary analytics destination is **Mixpanel**, which provides reliable, real-time event tracking and user behavior analysis.

## 2. Recommended Destination: Mixpanel

**Mixpanel is our confirmed and recommended analytics tool.**

*   **Reliable Real-Time Data:** Events from the app appear in Mixpanel's "Live View" within seconds, which is essential for testing and debugging.
*   **Works with Cloud-Mode:** It integrates seamlessly with our current Segment setup (Cloud-Mode), where the app sends data to Segment's servers first.
*   **No Extra App Code:** No additional SDKs or configuration are needed in the app itself. The connection is managed entirely within the Segment dashboard.

## 3. Core App Components

The analytics integration within the app itself consists of two main parts:

*   **Segment SDK (`@segment/analytics-react-native`)**: The official library for sending data to Segment from a React Native application.
*   **Analytics Service (`src/services/AnalyticsService.js`)**: A custom module created to centralize all analytics-related code. This service wraps the Segment SDK and provides simple, reusable functions for tracking events, identifying users, and tracking screen views.

## 4. How to Use and Extend

*   **Adding New Events**: To track a new event, import the `trackEvent` function from the analytics service and call it anywhere in the app:
    ```javascript
    import { trackEvent } from '../services/AnalyticsService';

    // ... later in your component
    trackEvent('Your Event Name', { customProperty: 'value' });
    ```
*   **Viewing Data**: Log in to your **Mixpanel** project and use the **Events** or **Live View** reports to see a real-time stream of data from the app.

---

## Appendix: Google Analytics 4 (Cloud-Mode) - Lessons Learned

We initially attempted to use the **Google Analytics 4 (Actions)** destination in **Cloud-Mode**. While Segment reported that events were "delivered," they never appeared in any GA4 reports (including `DebugView` and standard reports after a 24-hour wait).

### Root Cause

The issue is a fundamental limitation in how Google Analytics processes data for **mobile app streams**.

*   Our Cloud-Mode setup sends data from Segment's servers to Google's servers (a server-to-server request).
*   Google's backend identifies that the data is for a mobile app stream but is not coming directly from a recognized mobile device with a native Firebase SDK instance.
*   As a result, Google's servers accept the request (leading to a "Delivered" status in Segment) but then **silently discard the event** because it fails this validation check.

The **GA4 `DebugView` does not display server-to-server events**, which made this issue very difficult to diagnose.

### Conclusion

To successfully send data to a GA4 mobile stream, a **Device-Mode** implementation is required. This involves installing the native Firebase SDK in the app, which was a step we chose to avoid in favor of the simpler, more flexible integration with Mixpanel. 
import { createClient } from '@segment/analytics-react-native';

const segmentClient = createClient({
  writeKey: 'JzrAERrnyMRBPrOpaddiL57Cu3MxRV4g', 
  trackAppLifecycleEvents: true,
});

export const initialize = () => {
  // The client is already initialized above, this function is for future-proofing
  // in case more complex setup is needed.
  console.log('Segment initialized');
};

export const trackEvent = (event, properties) => {
  segmentClient.track(event, properties);
};

export const identifyUser = (userId, traits) => {
  segmentClient.identify(userId, traits);
};

export const screen = (name, properties) => {
  segmentClient.screen(name, properties);
};

export default segmentClient; 
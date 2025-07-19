import { createClient } from '@segment/analytics-react-native';
import Constants from 'expo-constants';

const getSegmentWriteKey = () => {
  if (Constants.expoConfig.extra?.SEGMENT_PRODUCTION_WRITE_KEY) {
    // Production key is available
    return Constants.expoConfig.extra.SEGMENT_PRODUCTION_WRITE_KEY;
  }
  // Fallback to development key
  return 'JzrAERrnyMRBPrOpaddiL57Cu3MxRV4g'; // Your development key
};

const segmentClient = createClient({
  writeKey: getSegmentWriteKey(),
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
import React from 'react';
import { StyleSheet } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

const StyledSegmentedControl = ({ values, selectedIndex, onChange }) => {
  return (
    <SegmentedControl
      values={values}
      selectedIndex={selectedIndex}
      onChange={onChange}
      tintColor="#4A5C4D"
      backgroundColor="#F5F5E9"
      fontStyle={styles.font}
      activeFontStyle={styles.activeFont}
      style={styles.control}
    />
  );
};

const styles = StyleSheet.create({
  control: {
    marginBottom: 20,
  },
  font: {
    fontFamily: 'serif',
  },
  activeFont: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StyledSegmentedControl; 
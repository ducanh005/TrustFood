import React from 'react';
import {  View, StyleSheet } from 'react-native';
import { moderateScale } from '../utils/responsive';

type Props = {
  checked: boolean;
  type?: 'checkbox' | 'radio' | 'switch';
};  

export const Toggle = ({ checked, type = 'checkbox' }: Props) => {
  return (
      <View
        style={[
          styles.base,
          type === 'radio' && styles.radio,
          type === 'switch' && styles.switch,
          checked && styles.active,
          !checked && styles.unactive,
        ]}
      />
  );
};

const styles = StyleSheet.create({
  base: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(6),
    borderWidth: 2,
  },
  radio: {
    borderRadius: 999,
  },
  switch: {
    width: moderateScale(36),
    borderRadius: 999,
  },
  active: {
    backgroundColor: '#FFC726',
    borderColor: '#FFC726',
  },
  unactive:{
    backgroundColor: 'transparent',
    borderColor: '#666',
  }
});

import { TextStyle } from 'react-native';
import { scaleFont } from '../utils/responsive';

const fontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  bold: 'Inter-Bold',
};

export const Typography = {
  H1: {
    fontFamily: fontFamily.bold,
    fontSize: scaleFont(32),
    lineHeight: scaleFont(40),
  } as TextStyle,

  H2: {
    fontFamily: fontFamily.bold,
    fontSize: scaleFont(28),
    lineHeight: scaleFont(36),
  } as TextStyle,

  H3: {
    fontFamily: fontFamily.bold,
    fontSize: scaleFont(24),
    lineHeight: scaleFont(32),
  } as TextStyle,

  H4: {
    fontFamily: fontFamily.bold,
    fontSize: scaleFont(20),
    lineHeight: scaleFont(28),
  } as TextStyle,

  H5: {
    fontFamily: fontFamily.medium,
    fontSize: scaleFont(18),
    lineHeight: scaleFont(26),
  } as TextStyle,

  H6: {
    fontFamily: fontFamily.medium,
    fontSize: scaleFont(16),
    lineHeight: scaleFont(24),
  } as TextStyle,

  H7: {
    fontFamily: fontFamily.medium,
    fontSize: scaleFont(14),
    lineHeight: scaleFont(20),
  } as TextStyle,

  P1_Regular: {
    fontFamily: fontFamily.regular,
    fontSize: scaleFont(16),
    lineHeight: scaleFont(24),
  } as TextStyle,

  P1_Medium: {
    fontFamily: fontFamily.medium,
    fontSize: scaleFont(16),
    lineHeight: scaleFont(24),
  } as TextStyle,

  P2_Regular: {
    fontFamily: fontFamily.regular,
    fontSize: scaleFont(14),
    lineHeight: scaleFont(22),
  } as TextStyle,

  P2_Medium: {
    fontFamily: fontFamily.medium,
    fontSize: scaleFont(14),
    lineHeight: scaleFont(22),
  } as TextStyle,

  P3_Regular: {
    fontFamily: fontFamily.regular,
    fontSize: scaleFont(13),
    lineHeight: scaleFont(20),
  } as TextStyle,

  P3_Medium: {
    fontFamily: fontFamily.medium,
    fontSize: scaleFont(13),
    lineHeight: scaleFont(20),
  } as TextStyle,

  P4_Regular: {
    fontFamily: fontFamily.regular,
    fontSize: scaleFont(12),
    lineHeight: scaleFont(18),
  } as TextStyle,

  P4_Medium: {
    fontFamily: fontFamily.medium,
    fontSize: scaleFont(12),
    lineHeight: scaleFont(18),
  } as TextStyle,
};

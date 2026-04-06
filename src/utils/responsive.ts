import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on a common Android design frame (390 x 844).
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

const widthRatio = SCREEN_WIDTH / BASE_WIDTH;
const heightRatio = SCREEN_HEIGHT / BASE_HEIGHT;

export const scale = (size: number) => PixelRatio.roundToNearestPixel(size * widthRatio);

export const verticalScale = (size: number) =>
  PixelRatio.roundToNearestPixel(size * heightRatio);

export const moderateScale = (size: number, factor = 0.5) =>
  PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor);

// For text, use a lighter scale so visual hierarchy remains close to original design.
export const scaleFont = (size: number) => moderateScale(size, 0.35);

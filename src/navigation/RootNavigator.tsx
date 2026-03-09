import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import AuthIntroScreen from '../screens/AuthIntroScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VerifyOTPScreen from '../screens/VerifyOTPScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import CreatePasswordScreen from '../screens/CreatePasswordScreen';
import SetNameScreen from '../screens/SetNameScreen';
import SendScreen from '../screens/SendScreen';
import CameraScreen from '../screens/CameraScreen';
import FoodReviewScreen from '../screens/FoodReviewScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Splash: undefined;
  AuthIntro: undefined;
  Login: undefined;
  Register: undefined;

  ForgotPassword: undefined;
  VerifyOTP: undefined;
  ResetPassword: {
    email: string;
    otp: string;
  };
  CreatePassword: { email: string };
  SetName: { email: string; password: string };
  Camera: undefined;
  Preview: { imageUri: string };
  Send: { imageUri: string };
  FoodReview: undefined;
};

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="AuthIntro" component={AuthIntroScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
      <Stack.Screen name="SetName" component={SetNameScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Send" component={SendScreen} />
      <Stack.Screen name="FoodReview" component={FoodReviewScreen} />
    </Stack.Navigator>
  );
}

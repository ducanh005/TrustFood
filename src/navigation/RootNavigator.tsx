import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/Core';
import {
  AuthIntroScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  VerifyOTPScreen,
  ResetPasswordScreen,
  CreatePasswordScreen,
  SetNameScreen,
} from '../screens/Auth';
import { CameraScreen, CameraPostScreen } from '../screens/Camera';
import { DiscoverScreen } from '../screens/Discover';
import {
  ProfileScreen,
  ProfileReviewsScreen,
  PersonalInfoScreen,
  ChangePasswordScreen,
  FriendsScreen,
} from '../screens/Profile';
import {
  TermsOfUseScreen,
  HelpCenterScreen,
  ShareAppScreen,
} from '../screens/Settings';
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
  Discover: undefined;
  Preview: { imageUri: string };
  Send: { imageUri: string };
  FoodReview: undefined;
  Profile: undefined;
  ProfileReviews: undefined;
  PersonalInfo: undefined;
  TermsOfUse: undefined;
  HelpCenter: undefined;
  ShareApp: undefined;
  ChangePassword: undefined;
  Friends: undefined;
};

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#181210' },
        animation: 'none',
      }}
    >
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
      <Stack.Screen name="Discover" component={DiscoverScreen} />
      <Stack.Screen name="Send" component={CameraPostScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ProfileReviews" component={ProfileReviewsScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="TermsOfUse" component={TermsOfUseScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="ShareApp" component={ShareAppScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Friends" component={FriendsScreen} />
    </Stack.Navigator>
  );
}

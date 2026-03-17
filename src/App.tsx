import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import ErrorBoundary from './components/ErrorBoundary';

const appNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#181210',
  },
};

export default function App() {
  return (
    <ErrorBoundary>
      <NavigationContainer theme={appNavigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </ErrorBoundary>
  );
}

import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';

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
      <AuthProvider>
        <NavigationContainer theme={appNavigationTheme}>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ErrorBoundary>
  );
}

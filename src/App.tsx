import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ErrorBoundary>
  );
}

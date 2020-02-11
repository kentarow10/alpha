import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import Auth from './src/auth/auth';

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Auth />
      </NavigationContainer>
    </PaperProvider>
  );
}

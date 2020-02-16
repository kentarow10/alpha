import React from 'react';
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from 'react-native-paper';
import { useColorScheme } from 'react-native-appearance';
import { NavigationContainer } from '@react-navigation/native';

import { PreferencesContext } from './context/preferencesContext';
import Auth from './auth/auth';

export const Main = () => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState<'light' | 'dark'>(
    colorScheme === 'dark' ? 'dark' : 'light',
  );

  function toggleTheme() {
    setTheme(theme => (theme === 'light' ? 'dark' : 'light'));
  }

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      theme,
    }),
    [theme],
  );

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider
        theme={
          theme === 'light'
            ? {
                ...DefaultTheme,
                colors: { ...DefaultTheme.colors, primary: '#1ba1f2' },
              }
            : {
                ...DarkTheme,
                colors: { ...DarkTheme.colors, primary: '#1ba1f2' },
              }
        }
      >
        <NavigationContainer
          theme={
            theme === 'light'
              ? {
                  ...DefaultTheme,
                  colors: { ...DefaultTheme.colors, primary: '#1ba1f2' },
                }
              : {
                  ...DarkTheme,
                  colors: { ...DarkTheme.colors, primary: '#1ba1f2' },
                }
          }
        >
          <Auth />
        </NavigationContainer>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
};

import React from 'react';
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from 'react-native-paper';
import { useColorScheme } from 'react-native-appearance';
import { NavigationContainer } from '@react-navigation/native';

import { PreferencesContext } from './context/preferencesContext';
import Auth from './auth/nav';

{
  /* <resources>
  <color name="primaryColor">#a8c8db</color>
  <color name="primaryLightColor">#dafbff</color>
  <color name="primaryDarkColor">#7897a9</color>
  <color name="secondaryColor">#ffd740</color>
  <color name="secondaryLightColor">#ffff74</color>
  <color name="secondaryDarkColor">#c8a600</color>
  <color name="primaryTextColor">#000000</color>
  <color name="secondaryTextColor">#000000</color>

  青緑系  #138d90
  スイカ  #fd3c3c
  山吹色  #ffb74c
  紺色    #061283

#00cffa
#ff0038
#ffce38
</resources> */
}

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
                colors: {
                  ...DefaultTheme.colors,
                  primary: 'white',
                  background: '#00cffa',
                  surface: '#ffffff',
                  accent: '#ff1744',
                },
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
                  colors: {
                    primary: 'white',
                    background: '#00cffa',
                    text: 'black',
                    card: '#9ea7aa',
                    border: '#ff1744',
                  },
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

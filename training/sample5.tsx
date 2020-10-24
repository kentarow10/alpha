/* eslint-disable no-undef */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DrawerNavCreator from './BasicNav/BasicNav';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerContent } from './drawerContent';
import { useColorScheme } from 'react-native-appearance';
import { PreferencesContext } from '../src/context/preferencesContext';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: height,
    // width: width,
    justifyContent: 'center',
    backgroundColor: 'orange',
    padding: 8,
    // zIndex: -1,
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: 'purple',
    borderRadius: 50,
  },
});

const Drawer = DrawerNavCreator();

const red = () => {
  return <View style={{ backgroundColor: 'white', flex: 1 }}></View>;
};
const blue = () => {
  return <View style={{ backgroundColor: 'white', flex: 1 }}></View>;
};
const yellow = () => {
  return <View style={{ backgroundColor: 'white', flex: 1 }}></View>;
};
const orange = () => {
  return <View style={{ backgroundColor: 'white', flex: 1 }}></View>;
};
const green = () => {
  return <View style={{ backgroundColor: 'white', flex: 1 }}></View>;
};

const pr = {
  color: 'orange',
  size: 20,
  focused: false,
};

const orangeIcon: React.ReactNode = pr => {
  return (
    <React.Fragment>
      <MaterialCommunityIcons
        name="fruit-sitrus"
        color={pr.color}
        size={pr.size}
      />
    </React.Fragment>
  );
};

const RootNavigator = () => {
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
        // 全体的ににテーマの適用ができる
        theme={
          theme === 'light'
            ? {
                ...DefaultTheme,
                colors: {
                  ...DefaultTheme.colors,
                  background: 'white',
                  onSurface: 'white',
                  text: 'black',
                },
              }
            : {
                ...DarkTheme,
                colors: {
                  ...DarkTheme.colors,
                  background: '#1b2333',
                  surface: '#1b2333',
                  // text: 'red',
                  text: '#d5eaff',
                },
              }
        }
      >
        <NavigationContainer
          // これに依存する部分にテーマの適用ができる
          theme={
            theme === 'light'
              ? {
                  ...DefaultTheme,
                  colors: {
                    ...DefaultTheme.colors,
                    primary: '#1ba1f2',
                    card: 'white',
                  },
                }
              : {
                  ...DarkTheme,
                  colors: {
                    ...DarkTheme.colors,
                    primary: '#1ba1f2',
                    card: '#1b2333',
                    text: '#d5eaff',
                  },
                }
          }
        >
          <Drawer.Navigator
            drawerContent={props => <DrawerContent {...props} />}
          >
            <Drawer.Screen
              name="RED"
              component={red}
              options={{
                inTab: true,
                icon: {
                  name: 'account-outline',
                  // color: 'red',
                  // size: 30,
                },
              }}
            />
            <Drawer.Screen
              name="BLUE"
              component={blue}
              options={{
                inTab: true,
                icon: {
                  name: 'home-outline',
                  // color: 'blue',
                  // size: 30,
                },
              }}
            />
            <Drawer.Screen
              name="YELLOW"
              component={yellow}
              options={{
                inTab: true,
                icon: {
                  name: 'link-variant',
                  // color: 'yellow',
                  // size: 30,
                },
              }}
            />
            <Drawer.Screen
              name="ORANGE"
              component={orange}
              options={{
                inTab: false,
                icon: {
                  name: 'lightbulb-on-outline',
                  color: 'orange',
                  size: 20,
                },
              }}
            />
            <Drawer.Screen
              name="GREEN"
              component={green}
              options={{
                inTab: false,
                icon: {
                  name: 'leaf',
                  color: 'green',
                  size: 20,
                },
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
};

export default RootNavigator;

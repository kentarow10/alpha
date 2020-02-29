import React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import myNavCreator from './myNav/navCreator';

import { StackNavigator } from './stack';
import { DrawerContent } from './drawerContent';
import { View } from 'react-native';
import Profile from '../profile/profile';
import MyNices from '../drawer/getNice';
import TimeLine from '../timeline/timeline';

// const Drawer = createDrawerNavigator();
const Drawer = myNavCreator();

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

export const RootNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="PROFILE"
        component={Profile}
        options={{
          inTab: true,
          icon: {
            name: 'account-outline',
          },
        }}
      />
      <Drawer.Screen
        name="TIMELINE"
        component={TimeLine}
        options={{
          inTab: true,
          icon: {
            name: 'home-outline',
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
          },
        }}
      />
      <Drawer.Screen
        name="いいねした投稿"
        component={MyNices}
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
  );
};

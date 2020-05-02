/* eslint-disable @typescript-eslint/no-empty-function */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  // DrawerContentComponentProps,
  // DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  DrawerContentComponentProps,
  DrawerContentOptions,
} from './BasicNav/types';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import {
  Avatar,
  Caption,
  Drawer,
  Paragraph,
  Switch,
  Text,
  Title,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';

import { PreferencesContext } from '../src/context/preferencesContext';
import {
  BaseRouter,
  DrawerActions,
  NavigationContext,
} from '@react-navigation/native';

type Props = DrawerContentComponentProps<DrawerContentOptions>;
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  drawerContent: {
    // flex: 1,
    height: height,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export function DrawerContent(props: Props) {
  const paperTheme = useTheme();
  const { theme, toggleTheme } = React.useContext(PreferencesContext);

  const translateX = Animated.interpolate(props.progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: paperTheme.colors.surface }}
    >
      <Animated.View
        style={[
          styles.drawerContent,
          {
            backgroundColor: paperTheme.colors.surface,
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.userInfoSection}>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              props.navigation.toggleDrawer();
            }}
          >
            <Avatar.Image
              source={{
                uri:
                  'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg',
              }}
              size={50}
            />
          </TouchableOpacity>
          <Title style={styles.title}>Dawid Urbaniak</Title>
          <Caption style={styles.caption}>@trensik</Caption>
          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                202
              </Paragraph>
              <Caption style={styles.caption}>Obserwuje</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                159
              </Paragraph>
              <Caption style={styles.caption}>Obserwujący</Caption>
            </View>
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          {props.state.routes
            .filter(
              route => props.descriptors[route.key].options.inTab === false,
            )
            .map(route => (
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons
                    name={
                      props.descriptors[route.key].options.icon != undefined
                        ? props.descriptors[route.key].options.icon.name
                        : 'account-outline'
                    }
                    color={paperTheme.colors.text}
                    size={
                      props.descriptors[route.key].options.icon != undefined
                        ? props.descriptors[route.key].options.icon.size
                        : 20
                    }
                  />
                )}
                label={route.name}
                onPress={() => {
                  // props.navigation.emit({ type: 'drawerClose' });
                  // if (fin) {
                  //   // props.navigation.dispatch({
                  //   //   ...DrawerActions.jumpTo(route.name),
                  //   //   target: props.state.key,
                  //   // });
                  // }
                }}
              />
            ))}
          {/* obj.bar != null ? obj.bar*100 : 0;
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="account-outline"
                color={color}
                size={size}
              />
            )}
            label="Profile"
            onPress={() => {
              // props.navigation.dispatch({
              //   ...DrawerActions.jumpTo(route.name),
              //   target: state.key,
              // });
            }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="tune" color={color} size={size} />
            )}
            label="Preferences"
            onPress={() => {}}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="bookmark-outline"
                color={color}
                size={size}
              />
            )}
            label="Bookmarks"
            onPress={() => {}}
          /> */}
        </Drawer.Section>
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={toggleTheme}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={theme === 'dark'} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </Animated.View>
    </DrawerContentScrollView>
  );
}

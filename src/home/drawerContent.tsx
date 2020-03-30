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
} from './myNav/types';
import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
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
  Button,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';

import { PreferencesContext } from '../context/preferencesContext';
import { BaseRouter, DrawerActions } from '@react-navigation/native';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { GetAllMe } from '../store/me/me';
import { asyncLink, DetailState } from '../store/behind/behind';
import { rtdb } from '../../firebase/firebase';

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
  modal: {
    backgroundColor: 'white',
    padding: 10,
    height: height / 4,
    width: (width * 2) / 3,
    borderWidth: 15,
    borderRadius: 45,
    borderColor: 'white',
  },
});

export function DrawerContent(props: Props) {
  const dispatch = useDispatch();
  const paperTheme = useTheme();
  const { theme, toggleTheme } = React.useContext(PreferencesContext);
  const mypins = useSelector(GetAllMe);
  const detail = useSelector(DetailState);
  const [modal, setModal] = useState(false);
  const [selectedItem, setItem] = useState({
    ansDoc: '',
    postDoc: '',
    uri: '',
    thm: '',
    body: '',
  });

  const mutualCheck = async (fromAnsDoc: string, toAnsDoc: string) => {
    const fromRef = rtdb.ref(fromAnsDoc);
    const toRef = rtdb.ref(toAnsDoc);
    let c1 = false;
    let c2 = false;
    fromRef.transaction(function(frommmm) {
      if (frommmm.from[toAnsDoc]) {
        c1 = true;
      }
    });
    toRef.transaction(function(toooo) {
      if (toooo.to[fromAnsDoc]) {
        c2 = true;
      }
    });
    if (c1 && c2) {
      const refFrom = rtdb.ref(fromAnsDoc + '/mutual/' + toAnsDoc);
      // refFrom.set({
      //   ...fromRef.from[toAnsDoc],
      // });
      console.log('相互');

      return true;
    } else if (c1 || c2) {
      console.log('おかしい');
    } else {
      return false;
    }
  };

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
            backgroundColor: 'white',
            transform: [{ translateX }],
          },
        ]}
      >
        {props.mypinsMode ? (
          <>
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
            </View>
            <View style={styles.drawerSection}>
              <FlatList
                data={mypins.myPins}
                renderItem={item => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        console.log(item.item);
                        setItem({
                          ansDoc: item.item.ansDoc,
                          postDoc: item.item.postDoc,
                          uri: item.item.uri,
                          thm: item.item.thms[item.item.orderThm - 1],
                          body: item.item.body,
                        });
                        setModal(true);
                      }}
                    >
                      <View>
                        <Image
                          source={{ uri: item.item.uri }}
                          style={{ width: 50, height: 50 }}
                        />
                        <Text>{item.item.thms[item.item.orderThm - 1]}</Text>
                        <Text>{item.item.body}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
            <Modal
              isVisible={modal}
              onBackdropPress={() => {
                setModal(false);
              }}
            >
              <View style={styles.modal}>
                <Text>この回答からリンクしますか？</Text>
                <Button
                  onPress={() => {
                    mutualCheck(selectedItem.ansDoc, detail.dpram.ansDoc);
                  }}
                >
                  相互チェック
                </Button>

                <Button
                  onPress={() => {
                    dispatch(
                      asyncLink(
                        detail.dpram,
                        selectedItem.ansDoc,
                        selectedItem.postDoc,
                        selectedItem.uri,
                        selectedItem.thm,
                        selectedItem.body,
                      ),
                    );
                  }}
                >
                  OK!
                </Button>
              </View>
            </Modal>
          </>
        ) : (
          <>
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
                  route => props.descriptors[route.key].options.inNav === true,
                )
                .map(route => (
                  <DrawerItem
                    key={route.key}
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
                      props.navigation.dispatch({
                        ...DrawerActions.jumpTo(route.name),
                        target: props.state.key,
                      });
                    }}
                  />
                ))}
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
          </>
        )}
      </Animated.View>
    </DrawerContentScrollView>
  );
}

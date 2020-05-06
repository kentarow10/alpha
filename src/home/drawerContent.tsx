/* eslint-disable @typescript-eslint/no-empty-function */
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
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
import React, { useState, useEffect } from 'react';
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
  Divider,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import firebase from '../../firebase/firebase';
import { PreferencesContext } from '../context/preferencesContext';
import {
  BaseRouter,
  DrawerActions,
  NavigationContext,
} from '@react-navigation/native';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { GetAllMe } from '../store/me/me';
import { asyncLink, DetailState } from '../store/behind/behind';
import { rtdb } from '../../firebase/firebase';
import { cls, ScreenMgrState } from '../store/screenMgr/mgr';
import { useName } from '../hooks/useName';
import { GetUid, asyncLogout } from '../store/auth/auth';
import { stringOmitter } from '../helper';

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
    marginTop: 14,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    paddingTop: 8,
    marginBottom: 8,
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
    marginTop: 10,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  modal: {
    position: 'absolute',
    bottom: height / 2 - 80,
    left: width / 2 - (width * 2) / 6,
    backgroundColor: 'white',
    padding: 10,
    height: height / 4 - 24,
    width: (width * 2) / 3,
    borderWidth: 15,
    borderRadius: 20,
    borderColor: 'white',
  },
});

export function DrawerContent(props: Props) {
  const dispatch = useDispatch();
  const paperTheme = useTheme();
  const { theme, toggleTheme } = React.useContext(PreferencesContext);
  const uid = useSelector(GetUid);
  const me = useSelector(GetAllMe);
  const detail = useSelector(DetailState);
  // const mng = useSelector(ScreenMgrState);
  const [modal, setModal] = useState(false);
  const [selectedItem, setItem] = useState({
    ansDoc: '',
    postDoc: '',
    uri: '',
    width: 0,
    height: 0,
    thms: [],
    order: 1,
    body: '',
    postAt: new firebase.firestore.Timestamp(0, 0),
    ansAt: new firebase.firestore.Timestamp(0, 0),
    postBy: '',
    ansBy: '',
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
              <View
                style={{
                  height: 48,
                  justifyContent: 'center',
                  borderBottomColor: cls.grn,
                  borderBottomWidth: 3,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'myfont',
                    fontSize: 20,
                    textAlign: 'center',
                    // color: cls.grn,
                  }}
                >
                  どれからリンクしますか？
                </Text>
              </View>
              <Divider />
            </View>
            <View style={styles.drawerSection}>
              <FlatList
                data={me.myPins}
                renderItem={item => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        console.log(item.item);
                        setItem({
                          ansDoc: '',
                          postDoc: '',
                          uri: '',
                          width: 0,
                          height: 0,
                          thms: [],
                          order: 1,
                          body: '',
                          postAt: new firebase.firestore.Timestamp(0, 0),
                          ansAt: new firebase.firestore.Timestamp(0, 0),
                          postBy: '',
                          ansBy: '',
                        });
                        setModal(true);
                      }}
                    >
                      <View
                        style={{
                          marginBottom: 7,
                          borderLeftColor: cls.grn,
                          borderLeftWidth: 4,
                          borderRadius: 3,
                          marginLeft: 6,
                        }}
                      >
                        <View style={{ flexDirection: 'row' }}>
                          <Image
                            source={{ uri: item.item.uri }}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 10,
                              margin: 8,
                            }}
                          />
                          <View
                            style={{
                              height: 60,
                              marginVertical: 8,
                              // backgroundColor: 'red',
                              flex: 1,
                              padding: 8,
                            }}
                          >
                            <Text style={{ fontWeight: '500', fontSize: 14 }}>
                              {stringOmitter(
                                25,
                                item.item.thms[item.item.order - 1],
                              )}
                            </Text>
                          </View>
                        </View>
                        <Divider />
                        <View
                          style={{ paddingHorizontal: 16, paddingVertical: 16 }}
                        >
                          <Text style={{ fontWeight: '500', fontSize: 14 }}>
                            {stringOmitter(40, item.item.body)}
                          </Text>
                        </View>
                      </View>
                      {/* <Divider /> */}
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
                <Text style={{ fontFamily: 'myfont' }}>
                  この回答からリンクします
                </Text>
                {/* <Button
                  onPress={() => {
                    mutualCheck(selectedItem.ansDoc, detail.dpram.ansDoc);
                  }}
                >
                  相互チェック
                </Button> */}
                <View>
                  <Button
                    style={{
                      borderColor: '#DDDDDD',
                      borderWidth: 1,
                      marginTop: 24,
                      padding: 8,
                    }}
                    labelStyle={{
                      color: cls.grn,
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}
                    onPress={() => {
                      dispatch(
                        asyncLink(
                          detail.dpram,
                          selectedItem.ansDoc,
                          selectedItem.postDoc,
                          selectedItem.uri,
                          selectedItem.thms,
                          selectedItem.order,
                          selectedItem.body,
                        ),
                      );
                    }}
                  >
                    OK!
                  </Button>
                  <Button
                    style={{ marginTop: 12 }}
                    labelStyle={{ color: 'gray', fontSize: 12 }}
                    onPress={() => {
                      setModal(false);
                    }}
                  >
                    キャンセル
                  </Button>
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <>
            <View style={styles.userInfoSection}>
              <View style={{ height: 48, justifyContent: 'center' }}>
                <Text
                  style={{
                    fontFamily: 'myfont',
                    fontSize: 20,
                    textAlign: 'center',
                    color: cls.grn,
                  }}
                >
                  グラピィ
                </Text>
              </View>
              <Divider />
              <TouchableOpacity
                style={{
                  marginLeft: 10,
                  marginTop: 12,
                  justifyContent: 'center',
                }}
                onPress={() => {
                  props.navigation.toggleDrawer();
                }}
              >
                <Image
                  source={{
                    uri: me.iconPath,
                  }}
                  // source={{ uri: me.iconPath }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 20,
                    alignSelf: 'center',
                  }}
                />
              </TouchableOpacity>
              <Title
                style={
                  (styles.title,
                  {
                    fontFamily: 'myfont',
                    textAlign: 'center',
                    marginBottom: 8,
                  })
                }
              >
                {me.userName}
              </Title>
              <Divider />
              <Caption style={styles.caption}>id : trensik</Caption>
              <Divider />
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
                        color={cls.rd}
                        size={
                          props.descriptors[route.key].options.icon != undefined
                            ? props.descriptors[route.key].options.icon.size
                            : 20
                        }
                      />
                    )}
                    label={route.name}
                    onPress={() => {
                      // props.navigation.toggleDrawer();
                      props.navigation.navigate(route.name);
                    }}
                  />
                ))}
            </Drawer.Section>
            <Drawer.Section>
              <TouchableRipple onPress={toggleTheme}>
                <View style={styles.preference}>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{ marginTop: 6, marginRight: 28, marginLeft: 6 }}
                    >
                      <Feather
                        name="moon"
                        size={20}
                        color="rgba(0, 0, 0, 0.68)"
                      />
                    </View>

                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 12,
                        marginTop: 10,
                        color: 'rgba(0, 0, 0, 0.68)',
                      }}
                    >
                      ダークモード
                    </Text>
                  </View>

                  <View pointerEvents="none">
                    <Switch value={theme === 'dark'} />
                  </View>
                </View>
              </TouchableRipple>
              <Divider />
              <TouchableOpacity
                onPress={() => {
                  alert('logout');
                  dispatch(asyncLogout());
                  props.navigation.goBack(null);
                }}
              >
                <View style={styles.preference}>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{ marginTop: 6, marginRight: 28, marginLeft: 6 }}
                    >
                      <MaterialCommunityIcons
                        name="logout"
                        size={20}
                        color="rgba(0, 0, 0, 0.68)"
                      />
                    </View>

                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 12,
                        marginTop: 10,
                        color: 'rgba(0, 0, 0, 0.68)',
                      }}
                    >
                      ログアウト
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Drawer.Section>
          </>
        )}
      </Animated.View>
    </DrawerContentScrollView>
  );
}

/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useTheme,
  Card,
  Avatar,
  Title,
  Paragraph,
  Button,
  Divider,
} from 'react-native-paper';
import {
  View,
  Button as Bt,
  Image,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  GetAllMe,
  asyncGetMyInfo,
  asyncGetMyPosts,
  asyncGetMyPins,
} from '../store/me/me';
import firebase from '../../firebase/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';
import { asyncGetAnss } from '../store/behind/behind';
import { NavigationContext } from '@react-navigation/native';
import { Ftext } from '../components/Ftext';
import { Tegaki } from '../components/Tegaki';
import { asyncGetUserName, cls, ScreenMgrState } from '../store/screenMgr/mgr';
import { GetUid } from '../store/auth/auth';
import { useName } from '../hooks/useName';
import { Header } from '../components/header';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { calcHeightRank } from '../helper';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const calcmt = (r: number) => {
  switch (r) {
    case 650:
      return 1;
    case 700:
      return 1;
    case 750:
      return 5;
    case 800:
      return 10;
    case 850:
      return 15;
    default:
      return 15;
  }
};

const profile = () => {
  const dispatch = useDispatch();
  const me = useSelector(GetAllMe);
  const uid = useSelector(GetUid);
  // const mng = useSelector(ScreenMgrState);
  const styles = StyleSheet.create({
    btns: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      // marginVertical: 12,
      marginTop: calcmt(calcHeightRank(HEIGHT)),
      marginHorizontal: 36,
      backgroundColor: 'white',
      paddingVertical: 9,
      paddingHorizontal: 51,
      // borderRadius: 8,
      shadowColor: 'green',
      shadowRadius: 4,
      shadowOpacity: 0.1,
      shadowOffset: {
        height: 1,
        // width: 1,
      },
    },
    btns2: {
      marginTop: 2,
      // marginVertical: 12,
      marginHorizontal: 36,
      backgroundColor: 'white',
      paddingVertical: 9,
      paddingHorizontal: 40,
      // borderRadius: 8,
      shadowColor: cls.grn,
      shadowRadius: 2,
      shadowOpacity: 0.1,
      shadowOffset: {
        height: 1,
        // width: 1,
      },
    },
  });

  useEffect(() => {
    dispatch(asyncGetMyInfo(uid));
    dispatch(asyncGetMyPosts(uid));
    dispatch(asyncGetMyPins(uid));
  }, []);

  useEffect(() => {
    if (me.edit.done) {
      dispatch(asyncGetMyInfo(uid));
    }
  }, [me.edit.done]);

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <Header mode="me" />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ height: WIDTH / 1.414 }}>
          <View
            style={{
              width: WIDTH,
              flex: 1,
              backgroundColor: 'gray',
              // borderBottomLeftRadius: 60,
              // borderBottomRightRadius: 60,
            }}
          >
            <Image
              source={{
                uri: me.homePath,
              }}
              style={{ width: WIDTH, height: WIDTH / 1.414 }}
            />
          </View>
          <Divider />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ width: WIDTH, backgroundColor: 'white', flex: 4 }}>
            <View
              style={{
                position: 'absolute',
                top: -28,
                left: WIDTH / 2 - 30,
                width: 62,
                height: 62,
                backgroundColor: 'gray',
                borderWidth: 2,
                borderRadius: 20,
                borderColor: 'gray',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={{ uri: me.iconPath }}
                style={{ width: 60, height: 60, borderRadius: 20 }}
              />
            </View>
            <View style={{ marginTop: 48, alignSelf: 'center' }}>
              <Text style={{ fontFamily: 'myfont' }}>{me.userName}</Text>
            </View>
            <View
              style={{
                paddingHorizontal: 36,
                paddingVertical: 14,
                alignSelf: 'center',
                backgroundColor: 'white',
              }}
            >
              <Text style={{ fontFamily: 'myfont' }}>{me.siBody}</Text>
            </View>
          </View>
          <View
            style={{
              flex: 5,
              justifyContent: 'center',
            }}
          >
            {/* <View></View> */}
            <TouchableOpacity style={styles.btns} onPress={() => {}}>
              <Entypo name="documents" size={16} color={cls.grn} />
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 12,
                  textAlign: 'center',
                  marginTop: 4,
                }}
              >
                投稿　　　　　　　{me.myPosts.length}件
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btns} onPress={() => {}}>
              <MaterialCommunityIcons name="hand" size={16} color={cls.grn} />
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 12,
                  textAlign: 'center',
                  marginTop: 4,
                }}
              >
                回答　　　　　　　{me.myPins.length}件
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btns} onPress={() => {}}>
              <MaterialCommunityIcons
                name="thumb-up-outline"
                size={16}
                color={cls.grn}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 12,
                  textAlign: 'center',
                  marginTop: 4,
                }}
              >
                いいね！　　　　　　件
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btns} onPress={() => {}}>
              <MaterialCommunityIcons
                name="lightbulb-on"
                size={16}
                color={cls.grn}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 12,
                  textAlign: 'center',
                  marginTop: 4,
                }}
              >
                分かる！　　　　　　件
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;

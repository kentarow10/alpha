import React, { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Header } from '../components/header';
import {
  SafeAreaView,
  View,
  Dimensions,
  Image,
  Text,
  TextInput,
} from 'react-native';
import { Divider, Button, Provider, Portal } from 'react-native-paper';
import { useName } from '../hooks/useName';
import { GetAllMe } from '../store/me/me';
import { GetUid } from '../store/auth/auth';
import { cls } from '../store/screenMgr/mgr';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const EditProfile = () => {
  const me = useSelector(GetAllMe);
  const uid = useSelector(GetUid);
  const myname = useName(uid);

  return (
    <SafeAreaView>
      <Header mode="back" />
      <ScrollView>
        <View style={{ height: WIDTH / 1.414 }}>
          <View
            style={{
              width: WIDTH,
              flex: 1,
              backgroundColor: '#ccc',
              justifyContent: 'center',
            }}
          >
            <Image
              source={{ uri: '' }}
              style={{ width: WIDTH, height: WIDTH / 1.414 }}
            />
            <Provider>
              <Portal>
                <View
                  style={{
                    backgroundColor: 'transparent',
                    opacity: 0.8,
                    height: 60,
                    width: 60,
                    borderRadius: 20,
                    position: 'absolute',
                    bottom: WIDTH / 4,
                    left: WIDTH / 2.35,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera-image"
                    size={48}
                    color="gray"
                  />
                </View>
              </Portal>
            </Provider>
          </View>
          <Divider />
        </View>
        <View style={{ width: WIDTH, backgroundColor: 'white', flex: 4 }}>
          <View
            style={{
              position: 'absolute',
              top: -28,
              left: WIDTH / 2 - 30,
              width: 60,
              height: 60,
              backgroundColor: 'transparent',
            }}
          >
            <Image
              source={{ uri: me.iconPath }}
              style={{ width: 60, height: 60, borderRadius: 20 }}
            />
            <Provider>
              <Portal>
                <View
                  style={{
                    backgroundColor: 'transparent',
                    opacity: 0.8,
                    height: 60,
                    width: 60,
                    borderRadius: 20,
                    position: 'absolute',
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera-image"
                    size={24}
                    color="gray"
                  />
                </View>
              </Portal>
            </Provider>
          </View>
          <View style={{ marginTop: 48, alignSelf: 'center' }}>
            <Text style={{ fontWeight: 'bold' }}>なまえ</Text>
            <TextInput
              style={{
                width: 220,
                marginTop: 6,
                padding: 10,
                borderBottomColor: cls.grn,
                borderBottomWidth: 1,
              }}
              value={myname}
              selectionColor={cls.grn}
            />
          </View>
          <View
            style={{
              marginTop: 8,
              paddingHorizontal: 36,
              paddingVertical: 22,
              alignSelf: 'center',
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>自己紹介文</Text>
            <TextInput
              style={{
                width: 300,
                marginTop: 6,
                padding: 10,
                borderBottomColor: cls.grn,
                borderBottomWidth: 1,
              }}
              multiline={true}
              value={me.siBody}
              selectionColor={cls.grn}
            />
          </View>
          <View
            style={{
              marginTop: 18,
              paddingHorizontal: 36,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}
          >
            <TouchableOpacity
              style={{
                width: 100,
                padding: 14,
                borderRadius: 12,
                backgroundColor: cls.rd,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                保存する
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

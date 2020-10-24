import React, { useEffect, useContext, useState, useRef } from 'react';
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
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Divider, Button, Provider, Portal } from 'react-native-paper';
import { useName } from '../hooks/useName';
import {
  GetAllMe,
  asyncSaveProfile,
  asyncChooseImage,
  initEditScreen,
} from '../store/me/me';
import { GetUid } from '../store/auth/auth';
import { cls, ScreenMgrState } from '../store/screenMgr/mgr';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContext, DrawerActions } from '@react-navigation/native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const EditProfile = () => {
  const dispatch = useDispatch();
  const me = useSelector(GetAllMe);
  const uid = useSelector(GetUid);
  const [newName, setNewName] = useState(me.userName);
  const [newSiBody, setNewSiBody] = useState(me.siBody);
  const [keyboard, setKeyboard] = useState(false);
  const navigation = useContext(NavigationContext);
  const navState = useSelector(ScreenMgrState);

  const scrl = useRef(null);

  const _keyboardWillShow = () => {
    setKeyboard(true);
  };
  const _keyboardDidShow = () => {
    // alert('Keyboard Shown');
    scrl.current.scrollToEnd();
  };

  useEffect(() => {
    if (me.edit.done) {
      navigation.navigate('PROFILE');
    }

    return;
  }, [me.edit.done]);

  useEffect(() => {
    setNewName(me.userName);
    setNewSiBody(me.siBody);
    dispatch(initEditScreen({ homeUri: me.homePath, iconUri: me.iconPath }));
    Keyboard.addListener('keyboardWillShow', _keyboardWillShow);
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    // Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardWillShow', _keyboardWillShow);
      // Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, [navState.navState]);

  return (
    <SafeAreaView>
      <Header mode="back" />
      {/* <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      > */}
      <ScrollView ref={scrl}>
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
              source={{ uri: me.edit.homeUri }}
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
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(asyncChooseImage('home'));
                    }}
                  >
                    <MaterialCommunityIcons
                      name="camera-image"
                      size={56}
                      color={cls.grn}
                    />
                  </TouchableOpacity>
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
              width: 62,
              height: 62,
              backgroundColor: '#ccc',
              borderWidth: 2,
              borderRadius: 20,
              borderColor: 'gray',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={{ uri: me.edit.iconUri }}
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
                  <TouchableOpacity
                    onPress={() => {
                      console.log('called !!!');
                      dispatch(asyncChooseImage('icon'));
                    }}
                  >
                    <MaterialCommunityIcons
                      name="camera-image"
                      size={34}
                      color={cls.grn}
                    />
                  </TouchableOpacity>
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
                fontFamily: 'myfont',
              }}
              value={newName}
              selectionColor={cls.grn}
              onChangeText={setNewName}
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>ひとこと</Text>
              <Text style={{ fontWeight: '300', color: 'gray' }}>
                あと{70 - newSiBody.length}文字
              </Text>
            </View>
            <TextInput
              style={{
                width: 300,
                marginTop: 6,
                padding: 10,
                borderBottomColor: cls.grn,
                borderBottomWidth: 1,
                fontFamily: 'myfont',
              }}
              maxLength={70}
              multiline={true}
              value={newSiBody}
              selectionColor={cls.grn}
              onChangeText={setNewSiBody}
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
              onPress={() => {
                dispatch(
                  asyncSaveProfile(
                    uid,
                    newName,
                    newSiBody,
                    me.edit.homeUri,
                    me.edit.homeName,
                    me.edit.isHomeUpdate,
                    me.edit.iconUri,
                    me.edit.iconName,
                    me.edit.isIconUpdate,
                  ),
                );
              }}
              style={{
                width: 100,
                padding: 14,
                borderRadius: 12,
                backgroundColor: cls.grn,
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
        {keyboard ? <View style={{ height: 300 }}></View> : <></>}
      </ScrollView>
    </SafeAreaView>
  );
};

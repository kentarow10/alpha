import React, { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { Header } from '../components/header';
import { SafeAreaView, View, Dimensions, Image, Text } from 'react-native';
import { Divider, TextInput } from 'react-native-paper';
import { useName } from '../hooks/useName';
import { GetAllMe } from '../store/me/me';
import { GetUid } from '../store/auth/auth';

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
              backgroundColor: 'orange',
            }}
          ></View>
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
          </View>
          <View style={{ marginTop: 44, alignSelf: 'center' }}></View>
          <View
            style={{
              paddingHorizontal: 36,
              paddingVertical: 18,
              alignSelf: 'center',
              backgroundColor: 'white',
            }}
          ></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

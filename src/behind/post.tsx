/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useTheme,
  Card,
  Avatar,
  Title,
  Paragraph,
  Button,
  TextInput,
} from 'react-native-paper';
import {
  View,
  Button as Bt,
  Image,
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { GetAllMe, asyncGetMyInfo, asyncGetMyCombs } from '../store/me/me';
import firebase from '../../firebase/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';
import {
  asyncGetAnss,
  PostState,
  asyncChooseImage,
} from '../store/behind/behind';
import { GetUid } from '../store/auth/auth';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

const post = () => {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    headerBar: {
      backgroundColor: colors.background,
      width: W,
      height: 50,
    },
    wrapper: {
      height: 100,
      backgroundColor: 'red',
    },
    slide1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#9DD6EB',
    },
    slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#97CAE5',
    },
    slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#92BBD9',
    },
    text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold',
    },
  });
  const dispatch = useDispatch();
  const state = useSelector(PostState);
  const uid = useSelector(GetUid);

  const [thm1, setThm1] = useState('');
  const [thm2, setThm2] = useState('');
  const [thm3, setThm3] = useState('');

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={styles.headerBar}>
        <Text
          style={{
            height: 40,
            marginTop: 10,
            color: 'white',
            fontSize: 28,
            textAlign: 'center',
            // fontFamily: 'MyFont',
          }}
        >
          シェアピ
        </Text>
      </View>
      <Card>
        {state.url === '' ? (
          <>
            <Button
              onPress={() => {
                dispatch(asyncChooseImage());
              }}
            >
              画像を選択
            </Button>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => {
                dispatch(asyncChooseImage());
              }}
            >
              <Image
                source={{ uri: state.url }}
                resizeMode="contain"
                style={{ width: W, height: 400, backgroundColor: 'black' }}
              />
            </TouchableOpacity>
          </>
        )}
      </Card>

      {/* <TextInput
          label="お題１"
          mode="outlined"
          value={thm1}
          onChangeText={setThm1}
        /> */}

      <Swiper style={styles.wrapper} showsButtons={true}>
        <View style={styles.slide1}>
          <Text style={styles.text}>Hello Swiper</Text>
        </View>
        <TextInput
          label="お題２"
          mode="outlined"
          value={thm2}
          onChangeText={setThm2}
        />
        <View style={styles.slide3}>
          <Text style={styles.text}>And simple</Text>
        </View>
      </Swiper>

      {/* <TextInput
          label="お題２"
          mode="outlined"
          value={thm2}
          onChangeText={setThm2}
        />
        <TextInput
          label="お題３"
          mode="outlined"
          value={thm3}
          onChangeText={setThm3}
        /> */}
    </SafeAreaView>
  );
};

export default post;

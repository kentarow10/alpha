/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState, useCallback, useContext } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native-gesture-handler';
import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';
import {
  asyncGetAnss,
  PostState,
  asyncChooseImage,
  remove3rd,
  remove2nd,
  add2nd,
  add3rd,
  asyncPost,
  done,
} from '../store/behind/behind';
import { GetUid } from '../store/auth/auth';
import { NavigationContext } from '@react-navigation/native';

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
  const navigation = useContext(NavigationContext);

  const [thm1, setThm1] = useState('');
  const [thm2, setThm2] = useState('');
  const [thm3, setThm3] = useState('');

  useEffect(() => {
    if (state.isDone) {
      navigation.navigate('PROFILE');
    }
  }, [state.isDone]);

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <ScrollView>
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
        <Button
          onPress={() => {
            console.log(state);
          }}
        >
          状態
        </Button>
        {state.addThm3 && state.addThm2 ? (
          <Swiper style={styles.wrapper} showsButtons={true}>
            <TextInput
              label="お題１"
              mode="outlined"
              value={thm1}
              onChangeText={setThm1}
            />
            <>
              <Button
                onPress={() => {
                  dispatch(remove2nd({}));
                }}
              >
                お題取り消し
              </Button>
              <TextInput
                label="お題２"
                mode="outlined"
                value={thm2}
                onChangeText={setThm2}
              />
            </>
            <>
              <Button
                onPress={() => {
                  dispatch(remove3rd({}));
                }}
              >
                お題取り消し
              </Button>
              <TextInput
                label="お題３"
                mode="outlined"
                value={thm3}
                onChangeText={setThm3}
              />
            </>
          </Swiper>
        ) : state.addThm2 ? (
          <Swiper style={styles.wrapper} showsButtons={true}>
            <TextInput
              label="お題１"
              mode="outlined"
              value={thm1}
              onChangeText={setThm1}
            />
            <>
              <Button
                onPress={() => {
                  dispatch(remove2nd({}));
                }}
              >
                お題取り消し
              </Button>
              <TextInput
                label="お題２"
                mode="outlined"
                value={thm2}
                onChangeText={setThm2}
              />
              <Button
                onPress={() => {
                  dispatch(add3rd({}));
                }}
              >
                お題追加
              </Button>
            </>
          </Swiper>
        ) : (
          <>
            <TextInput
              label="お題１"
              mode="outlined"
              value={thm1}
              onChangeText={setThm1}
            />
            <Button
              onPress={() => {
                dispatch(add2nd({}));
              }}
            >
              お題追加
            </Button>
          </>
        )}
        <Button
          onPress={() => {
            dispatch(
              asyncPost(
                uid,
                state.url,
                state.width,
                state.height,
                state.imageName,
                thm1,
                thm2,
                thm3,
                state.addThm2,
                state.addThm3,
              ),
            );
          }}
        >
          投稿！
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default post;

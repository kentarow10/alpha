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
  ToggleButton,
} from 'react-native-paper';
import {
  View,
  Button as Bt,
  Image,
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native-gesture-handler';
import {
  asyncGetAnss,
  PostState,
  asyncChooseImage,
  asyncPost,
  done,
  postInit,
} from '../store/behind/behind';
import { GetUid } from '../store/auth/auth';
import { NavigationContext } from '@react-navigation/native';
import { inputThmSwitch as ITS } from '../components/inputThmSwitch';

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
  const [bbb, setBbb] = useState({ value: '1' });
  const canSubmit = (): boolean => {
    if (bbb.value === '3') {
      const c1 = thm1 === '';
      const c2 = thm2 === '';
      const c3 = thm3 === '';

      return !(c1 || c2 || c3);
    } else if (bbb.value === '2') {
      const c1 = thm1 === '';
      const c2 = thm2 === '';

      return !(c1 || c2);
    } else {
      const c1 = thm1 === '';

      return !c1;
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setThm1('');
      setThm2('');
      setThm3('');
      setBbb({ value: '1' });
      dispatch(postInit({}));
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (state.isDone) {
      console.log('done');
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
        <Text>お題の数</Text>
        <ToggleButton.Row
          onValueChange={value => setBbb({ value })}
          value={bbb.value}
        >
          <ToggleButton icon="numeric-1" value="1" />
          <ToggleButton icon="numeric-2" value="2" />
          <ToggleButton icon="numeric-3" value="3" />
        </ToggleButton.Row>
        <ITS
          numThm={Number(bbb.value)}
          thm1={thm1}
          thm2={thm2}
          thm3={thm3}
          setThm1={setThm1}
          setThm2={setThm2}
          setThm3={setThm3}
        />
        <Button
          disabled={!canSubmit()}
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
                Number(bbb.value),
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

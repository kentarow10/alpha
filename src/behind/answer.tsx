/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Font from 'expo-font';
import { useTheme, Button, TextInput, DefaultTheme } from 'react-native-paper';
import {
  View,
  Button as Bt,
  FlatList,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  NavigationContext,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import {
  PostedState,
  getParams,
  asyncGetAnss,
  DetailState,
  detailInit,
  asyncAnswer,
  AnsState,
  ansInit,
} from '../store/behind/behind';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { GetUid } from '../store/auth/auth';
import { thmSwitch as ThmSwitch } from '../components/thmSwitch';
import { postedImage as PostedImage } from '../components/postedImage';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const answer = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const posted = useSelector(PostedState);
  const uid = useSelector(GetUid);
  const ans = useSelector(AnsState);
  const navigation = useContext(NavigationContext);
  const [myans, setMyans] = useState('');
  const [order, setOrder] = useState(1);
  const proportion = posted.ppram.height / posted.ppram.width;
  const imgH = WIDTH * proportion;

  const canSubmit = (): boolean => {
    if (myans === '') {
      return false;
    }

    return true;
  };

  const styles = StyleSheet.create({
    headerBar: {
      flexDirection: 'row',
      backgroundColor: 'white',
      height: 40,
    },
    content: {
      backgroundColor: 'white',
      //   height: HEIGHT - 50,
      flex: 1,
    },
    text: {
      marginTop: 4,
      color: 'white',
      // fontFamily: 'MyFont',
      fontSize: 12,
      textAlign: 'right',
    },
    thm: {
      width: WIDTH - 8,
      height: 50,
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 4,
      //   borderColor: 'gray',
      borderStartColor: 'red',
      borderStartWidth: 8,
      borderTopStartRadius: 8,
      //   borderEndWidth: 3,
      //   borderWidth: 8,
      //   borderRadius: 15,
      //   backgroundColor: 'gray',
    },
    tabMock: {
      height: 36,
    },
  });
  const scrl = useRef(null);

  const _keyboardDidShow = () => {
    // alert('Keyboard Shown');
    scrl.current.scrollToEnd();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setMyans('');
      setOrder(1);
      dispatch(ansInit({}));
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (ans.isDone) {
      console.log('done');
      navigation.navigate('POSTED');
    }
  }, [ans.isDone]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    // Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      // Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  return (
    <React.Fragment>
      <SafeAreaView style={{ height: HEIGHT }}>
        <View style={styles.headerBar}>
          <Button
            onPress={() => {
              navigation.goBack();
            }}
          >
            戻る
          </Button>
          <Text
            style={{
              // height: 40,
              marginTop: 3,
              color: '#00A85A',
              fontSize: 20,
              textAlign: 'center',
              fontWeight: 'bold',
              // fontFamily: 'MyFont',
            }}
          >
            シェアピ
          </Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView ref={scrl}>
            <View style={styles.content}>
              <PostedImage uri={posted.ppram.uri} />
              {/* <Text style={styles.thm}>{posted.ppram.thms[0]}</Text> */}
              <ThmSwitch
                thm={posted.ppram.thms}
                order={order}
                setOrder={setOrder}
                numNice={posted.ppram.numNice}
                postAt={posted.ppram.createdAt}
                inAns={true}
              />
              <View style={{ flex: 1 }}>
                <TextInput
                  theme={{
                    ...DefaultTheme,
                    colors: { ...DefaultTheme.colors, primary: '#00A85A' },
                  }}
                  selectionColor="#00A85A"
                  dense={true}
                  onContentSizeChange={e => {
                    if (e.nativeEvent.contentSize.height > 80) {
                      console.log(e.nativeEvent.contentSize);
                      scrl.current.scrollToEnd();
                    }
                  }}
                  // underlineColor="#00A85A"
                  style={{
                    borderColor: '#00A85A',
                    margin: 18,
                    marginBottom: 9,
                    paddingVertical: 4,
                    lineHeight: 3,
                    paddingHorizontal: 16,
                  }}
                  mode="flat"
                  multiline={true}
                  value={myans}
                  onChangeText={setMyans}
                />
                <Button
                  disabled={!canSubmit()}
                  style={{
                    // justifyContent: 'flex-end',
                    alignSelf: 'flex-end',
                    marginRight: 18,
                    marginBottom: 9,
                    height: 30,
                    width: 64,
                    backgroundColor: canSubmit() ? '#00A85A' : 'gray',
                  }}
                  labelStyle={{
                    fontSize: 12,
                    color: 'white',
                    marginHorizontal: 9,
                  }}
                  onPress={() => {
                    dispatch(asyncAnswer(posted.ppram, order, myans, uid));
                  }}
                >
                  送信！
                </Button>
              </View>
              <View style={styles.tabMock}></View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </React.Fragment>
  );
};

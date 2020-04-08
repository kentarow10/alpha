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
import { accessibilityProps } from 'react-native-paper/lib/typescript/src/components/MaterialCommunityIcon';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

type Props = {
  scrlRef: React.MutableRefObject<any>;
  goPosted: () => void;
};

export const Answer = (props: Props) => {
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
  const [mock, setMock] = useState(false);

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
      paddingBottom: mock ? 280 : 0,
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
      //   backgroundColor: 'orange',
    },
  });

  const _keyboardWillShow = () => {
    setMock(true);
  };

  const _keyboardDidShow = () => {
    if (props.scrlRef) {
      props.scrlRef.current.scrollTo({ x: 0, y: 280, animation: true });
    }
  };

  const _keyboardDidHide = () => {
    props.scrlRef.current.scrollTo({ x: 0, y: 140, animation: true });
    setTimeout(() => {
      setMock(false);
    }, 0);
  };

  useEffect(() => {
    if (ans.isDone) {
      console.log('done');
      setMyans('');
      setOrder(1);
      dispatch(ansInit({}));
      props.goPosted();
    }
  }, [ans.isDone]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setMyans('');
      setOrder(1);
      dispatch(ansInit({}));
    });
    Keyboard.addListener('keyboardWillShow', _keyboardWillShow);
    // willHideでバグる
    // Keyboard.addListener('keyboardWillHide', _keyboardWillHide);
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      unsubscribe;
      Keyboard.addListener('keyboardWillShow', _keyboardWillShow);
      //   Keyboard.addListener('keyboardWillHide', _keyboardWillHide);
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  return (
    <React.Fragment>
      <View style={styles.content}>
        <ThmSwitch
          thm={posted.ppram.thms}
          order={order}
          setOrder={setOrder}
          numNice={posted.ppram.numNice}
          postAt={posted.ppram.createdAt}
          inAns={true}
        />
        {/* <View style={{ flex: 1 }}> */}
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
              props.scrlRef.current.scrollToEnd();
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
      {/* {mock ? <View style={{ height: 280 }}></View> : <></>} */}
      <View style={styles.tabMock}></View>
      {/* </View> */}
    </React.Fragment>
  );
};

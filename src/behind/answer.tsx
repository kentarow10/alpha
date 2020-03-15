/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Font from 'expo-font';
import { useTheme, Button, TextInput } from 'react-native-paper';
import {
  View,
  Button as Bt,
  FlatList,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  NavigationContext,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { PostedParams, NavigationParamList } from '../store/types';
import {
  PostedState,
  getParams,
  asyncGetAnss,
  DetailState,
  detailInit,
  asyncAnswer,
} from '../store/behind/behind';
import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';
import { mypinModeOn } from '../store/screenMgr/mgr';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { GetUid } from '../store/auth/auth';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const answer = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const posted = useSelector(PostedState);
  const uid = useSelector(GetUid);
  const navigation = useContext(NavigationContext);
  const [myans, setMyans] = useState('');
  const proportion = posted.ppram.height / posted.ppram.width;
  const imgH = WIDTH * proportion;

  const styles = StyleSheet.create({
    headerBar: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      width: WIDTH,
      height: 50,
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
  });

  useEffect(() => {
    return setMyans('');
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
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView>
            <View style={styles.content}>
              <Image
                // source={{ uri: '' }}
                source={{ uri: posted.ppram.uri }}
                resizeMode="contain"
                style={{ width: WIDTH, height: imgH, backgroundColor: 'black' }}
                // style={styles.img}
              />
              <Text style={styles.thm}>{posted.ppram.thms[0]}</Text>
              <TextInput
                // label="お題１"
                mode="outlined"
                value={myans}
                onChangeText={setMyans}
                multiline={true}
              />
              <Button
                onPress={() => {
                  dispatch(asyncAnswer(posted.ppram, 1, myans, uid));
                }}
              >
                回答送信
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </React.Fragment>
  );
};

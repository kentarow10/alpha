/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Font from 'expo-font';
import { useTheme, Button } from 'react-native-paper';
import {
  View,
  Button as Bt,
  FlatList,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
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
} from '../store/behind/behind';
import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';
import { mypinModeOn } from '../store/screenMgr/mgr';

// import { SafeAreaView } from 'react-native-safe-area-context';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const timeLine = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const detail = useSelector(DetailState);
  const navigation = useContext(NavigationContext);
  const route = useRoute<RouteProp<NavigationParamList, 'DETAIL'>>();
  const prm = route.params;

  const styles = StyleSheet.create({
    headerBar: {
      backgroundColor: colors.background,
      width: WIDTH,
      height: 50,
    },
    content: {
      backgroundColor: 'white',
      flex: 1,
    },
    text: {
      marginTop: 4,
      color: 'white',
      // fontFamily: 'MyFont',
      fontSize: 12,
      textAlign: 'right',
    },
  });
  const getFont = async () => {
    await Font.loadAsync({
      MyFont: require('../../assets/fonts/logotypejp_mp_b_1.1.ttf'),
    });
  };

  useEffect(() => {
    dispatch(
      detailInit({
        postDoc: prm.postDoc,
        ansDoc: prm.ansDoc,
        uri: prm.uri,
        width: prm.width,
        height: prm.height,
        thm: prm.thm,
        body: prm.body,
        numNice: prm.numNice,
        postedBy: prm.postedBy,
        ansBy: prm.ansBy,
        postedAt: prm.postedAt,
        ansAt: prm.ansAt,
      }),
    );
  }, [route.params]);

  return (
    <React.Fragment>
      <SafeAreaView style={{ height: HEIGHT }}>
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
        <View style={styles.content}>
          <Image
            source={{ uri: detail.dpram.uri }}
            resizeMode="contain"
            style={{
              width: detail.dpram.width,
              height: detail.dpram.height,
              backgroundColor: 'black',
            }}
            // style={styles.img}
          />
          <Text>{detail.dpram.thm}</Text>
          <Text>{detail.dpram.body}</Text>
          <Button
            onPress={() => {
              dispatch(mypinModeOn({}));
              navigation.toggleDrawer();
            }}
          >
            リンクする
          </Button>
        </View>
      </SafeAreaView>
    </React.Fragment>
  );
};

export default timeLine;

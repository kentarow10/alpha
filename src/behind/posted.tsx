/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext, useState } from 'react';
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
  getAnss,
  asyncNice,
  asyncListenNice,
} from '../store/behind/behind';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DialogContent from 'react-native-paper/lib/typescript/src/components/Dialog/DialogContent';
import { GetUid } from '../store/auth/auth';
import { thmSwitch as ThmSwitch } from '../components/thmSwitch';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const posted = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const navigation = useContext(NavigationContext);
  const posted = useSelector(PostedState);
  const uid = useSelector(GetUid);
  const route = useRoute<RouteProp<NavigationParamList, 'POSTED'>>();
  const prm = route.params;
  const [order, setOrder] = useState(1);

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
    actionBar: {
      flexDirection: 'row',
      height: 35,
      backgroundColor: 'gray',
    },
  });
  // const getFont = async () => {
  //   await Font.loadAsync({
  //     MyFont: require('../../assets/fonts/logotypejp_mp_b_1.1.ttf'),
  //   });
  // };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setOrder(1);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    dispatch(asyncListenNice(prm.postDoc));

    dispatch(
      getParams({
        postDoc: prm.postDoc,
        uri: prm.uri,
        width: prm.width,
        height: prm.height,
        owner: prm.owner,
        thms: prm.thms,
        createdAt: prm.postedAt,
      }),
    );
  }, [route.params]);
  useEffect(() => {
    dispatch(asyncGetAnss(prm.postDoc));
  }, [posted.ppram.postDoc]);

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
            source={{ uri: posted.ppram.uri }}
            resizeMode="contain"
            style={{ width: WIDTH, height: WIDTH, backgroundColor: 'black' }}
          />
          <ThmSwitch
            thm={posted.ppram.thms}
            order={order}
            setOrder={setOrder}
          />
          <View style={styles.actionBar}></View>
          <Button
            onPress={() => {
              dispatch(
                asyncNice(
                  posted.ppram.postDoc,
                  uid,
                  posted.ppram.uri,
                  posted.ppram.owner,
                ),
              );
            }}
          >
            良いね
          </Button>
          <Text>良いね数{posted.ppram.numNice}</Text>
          <FlatList
            style={{ height: 60 }}
            data={posted.ppram.niceByList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => {
              return (
                <View style={{ flex: 1, backgroundColor: 'red' }}>
                  <Text>{item.item}</Text>
                </View>
              );
            }}
          />
          <Button
            onPress={() => {
              navigation.navigate('ANSWER');
            }}
          >
            回答する
          </Button>
          <Text>{posted.ppram.thms[0]}</Text>
          <Text>{posted.ppram.thms[0]}の回答</Text>
          <FlatList
            style={{ height: 60 }}
            data={posted.anss}
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('DETAIL', {
                      postDoc: posted.ppram.postDoc,
                      ansDoc: item.item.ansDoc,
                      uri: posted.ppram.uri,
                      width: posted.ppram.width,
                      height: posted.ppram.height,
                      thm: posted.ppram.thms[item.item.orderThm - 1],
                      body: item.item.body,
                      numNice: posted.ppram.numNice,
                      postedBy: posted.ppram.owner,
                      ansBy: item.item.ansBy,
                      postedAt: posted.ppram.createdAt,
                      ansAt: item.item.ansAt,
                    });
                  }}
                >
                  <View style={{ flex: 1, backgroundColor: 'red' }}>
                    <Text>{item.item.body}</Text>
                    <Text>{item.item.ansBy}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          <Text>{posted.ppram.thms[1]}</Text>
          {/* react-native-swiper */}
        </View>
      </SafeAreaView>
    </React.Fragment>
  );
};

export default posted;

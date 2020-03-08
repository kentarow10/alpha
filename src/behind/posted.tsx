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
import { PostedState, getParams, asyncGetAnss } from '../store/behind/behind';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const posted = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const posted = useSelector(PostedState);
  const route = useRoute<RouteProp<NavigationParamList, 'POSTED'>>();
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
    console.log(prm);
    dispatch(
      getParams({
        postDoc: prm.postDoc,
        uri: prm.uri,
        owner: prm.owner,
        thms: prm.thms,
        createdAt: prm.postedAt,
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
          <Button
            style={{ height: 30, width: 30, backgroundColor: 'red' }}
            onPress={() => {
              console.log(posted);
            }}
          >
            aaaa
          </Button>
          {/* <Image
            source={{ uri: posted.ppram.uri }}
            resizeMode="contain"
            // style={styles.img}
          /> */}
          {/* react-native-swiper */}
        </View>
      </SafeAreaView>
    </React.Fragment>
  );
};

export default posted;

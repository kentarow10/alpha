/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Font from 'expo-font';
import { useTheme } from 'react-native-paper';
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

// import { SafeAreaView } from 'react-native-safe-area-context';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const timeLine = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const posted = useSelector(PostedState);
  // const navigation = useContext(NavigationContext);
  const route = useRoute<RouteProp<NavigationParamList, 'POSTED'>>();
  const params: PostedParams = {
    postDoc: route.params.postDoc,
    uri: route.params.uri,
    owner: route.params.owner,
    thms: route.params.thms,
    createdAt: route.params.createdAt,
  };

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
      fontFamily: 'MyFont',
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
    dispatch(getParams(params));
    dispatch(asyncGetAnss(route.params.postDoc));
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
              fontFamily: 'MyFont',
            }}
          >
            シェアピ
          </Text>
        </View>
        <View style={styles.content}>
          <Image
            source={{ uri: posted.ppram.uri }}
            resizeMode="contain"
            // style={styles.img}
          />
          {/* react-native-swiper */}
        </View>
      </SafeAreaView>
    </React.Fragment>
  );
};

export default timeLine;

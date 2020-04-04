/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Font from 'expo-font';
import {
  useTheme,
  Card,
  Avatar,
  Title,
  Paragraph,
  Button,
  Appbar,
  Provider,
  Portal,
} from 'react-native-paper';
import {
  View,
  Button as Bt,
  FlatList,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-paper';

// import { SafeAreaView } from 'react-native-safe-area-context';
import { GetPosts } from '../store/timeLine/selector';
import { asyncGetPosts } from '../store/timeLine/actions';
import { NavigationContext } from '@react-navigation/native';
import { TimeLime } from '../store/timeLine/timeLine';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const imgW = (WIDTH - 6) / 3;
const imgH = imgW * 1.414;

const timeLine = () => {
  const dispatch = useDispatch();
  const navigation = useContext(NavigationContext);
  const posts: TimeLime = useSelector(GetPosts);
  const { colors } = useTheme();

  // const getFont = async () => {
  //   await Font.loadAsync({
  //     MyFont: require('../../assets/fonts/logotypejp_mp_b_1.1.ttf'),
  //   });
  // };

  useEffect(() => {
    // getFont();
    dispatch(asyncGetPosts());
  }, []);

  const styles = StyleSheet.create({
    img: {
      width: imgW,
      height: imgH,
    },
    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      height: 40,
    },
    content: {
      backgroundColor: 'white',
      flex: 1,
    },
    area: {
      backgroundColor: 'black',
      opacity: 0.8,
      height: 18,
      width: imgW,
      position: 'absolute',
      bottom: 0,
    },
    text: {
      marginTop: 4,
      color: 'white',
      // fontFamily: 'MyFont',
      fontSize: 12,
      textAlign: 'right',
    },
  });

  return (
    <React.Fragment>
      <SafeAreaView style={{ height: HEIGHT }}>
        <View style={styles.headerBar}>
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
        <View style={styles.content}>
          <FlatList
            data={posts.posts}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            style={{ marginBottom: 36 }}
            renderItem={item => {
              return (
                <View style={{ flexDirection: 'column' }}>
                  {/* <View style={{ height: 57, width: imgW }}></View> */}
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('POSTED', {
                        postDoc: item.item.postDoc,
                        uri: item.item.uri,
                        width: item.item.width,
                        height: item.item.height,
                        thms: item.item.thms,
                        owner: item.item.owner,
                        postedAt: item.item.postedAt,
                      });
                    }}
                  >
                    <Card
                      style={{
                        width: imgW,
                        height: imgH,
                        backgroundColor: 'black',
                        margin: 1,
                        shadowColor: '#ccc',
                        shadowOffset: {
                          width: 0,
                          height: 6,
                        },
                        shadowRadius: 15,
                        shadowOpacity: 0.6,
                      }}
                    >
                      <Image
                        source={{ uri: item.item.uri }}
                        resizeMode="cover"
                        style={styles.img}
                      />
                      <Provider>
                        <Portal>
                          <View style={styles.area}>
                            <Provider>
                              <Portal>
                                <Text style={styles.text}>by username</Text>
                              </Portal>
                            </Provider>
                          </View>
                        </Portal>
                      </Provider>
                    </Card>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </React.Fragment>
  );
};

export default timeLine;

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

const imgW = (WIDTH - 81) / 2;
const imgH = imgW * 1.414;

const timeLine = () => {
  const dispatch = useDispatch();
  const navigation = useContext(NavigationContext);
  const posts: TimeLime = useSelector(GetPosts);
  const { colors } = useTheme();

  const getFont = async () => {
    await Font.loadAsync({
      MyFont: require('../../assets/fonts/logotypejp_mp_b_1.1.ttf'),
    });
  };

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
      backgroundColor: colors.background,
      width: WIDTH,
      height: 50,
    },
    content: {
      backgroundColor: 'white',
      flex: 1,
    },
    area: {
      backgroundColor: '#ff0038',
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
              height: 40,
              marginTop: 10,
              color: 'white',
              fontSize: 28,
              textAlign: 'center',
              //   fontWeight: '900',
              // fontFamily: 'MyFont',
            }}
          >
            シェアピ
          </Text>
        </View>
        <View style={styles.content}>
          <Button
            onPress={() => {
              console.log(posts.posts);
              console.log([1, 2, 3]);
              // alert(posts.posts);
            }}
            style={{ height: 30, width: 40, backgroundColor: 'blue' }}
          >
            おお
          </Button>
          {/* <FlatList
            // data={[1, 2, 3, 4, 5, 6, 7, 8]}
            data={posts.posts}
            keyExtractor={(item, index) => index.toString()}
            // horizontal={true}
            // numColumns={2}
            style={{ marginBottom: 36 }}
            renderItem={item => {
              return (
                <View style={{ height: 30, width: 30, backgroundColor: 'red' }}>
                  <Text>{item.item.owner}</Text>
                </View>
              );
            }}
          /> */}

          {/* <FlatList
            data={posts.posts}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            style={{ marginBottom: 36 }}
            renderItem={item => {
              return (
                <View
                  style={{ height: 30, width: 30, backgroundColor: 'red' }}
                ></View>
              );
            }}
          /> */}
          <FlatList
            data={posts.posts}
            keyExtractor={(item, index) => index.toString()}
            numColumns={1}
            style={{ marginBottom: 36 }}
            renderItem={item => {
              if (item.index % 2 === 1) {
                return (
                  <View style={{ flexDirection: 'column' }}>
                    <View style={{ height: 57, width: imgW }}></View>
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
                          marginLeft: 13.5,
                          marginRight: 27,
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
              } else if (item.index !== 0) {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('POSTED', {
                        doc: item.item.postDoc,
                        path: item.item.path,
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
                        marginLeft: 27,
                        marginRight: 13.5,
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
                );
              } else {
                return (
                  <View style={{ flexDirection: 'column' }}>
                    <View
                      style={{
                        height: 16,
                        width: imgW,
                        marginLeft: 27,
                        marginRight: 13.5,
                      }}
                    ></View>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('POSTED', {
                          doc: item.item.postDoc,
                          path: item.item.path,
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
                          marginLeft: 27,
                          marginRight: 13.5,
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
              }
            }}
          />
        </View>
      </SafeAreaView>
    </React.Fragment>
  );
};

export default timeLine;

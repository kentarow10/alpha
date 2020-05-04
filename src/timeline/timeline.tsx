/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext, useState } from 'react';
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
import { Header } from '../components/header';
import { TimeLimeScreen } from '../store/screenTypes';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const imgW = (WIDTH - 48) / 2;
const imgH = imgW * 1.414;

const timeLine = () => {
  const dispatch = useDispatch();
  const navigation = useContext(NavigationContext);
  const posts: TimeLimeScreen = useSelector(GetPosts);
  const { colors } = useTheme();

  useEffect(() => {
    // getFont();
    dispatch(asyncGetPosts());
  }, []);

  const styles = StyleSheet.create({
    img: {
      width: imgW,
      height: imgH,
      // overflow: 'scroll',
      borderRadius: 8,
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
      backgroundColor: 'gray',
      opacity: 0.8,
      height: 18,
      width: imgW - 8,
      position: 'absolute',
      borderRadius: 5,
      marginHorizontal: 4,
      bottom: 5,
    },
    text: {
      marginTop: 2,
      marginRight: 8,
      color: 'white',
      fontFamily: 'myfont',
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'right',
    },
  });

  const cardStyle = (index: number) => {
    if (index % 2 == 0) {
      return {
        width: imgW,
        height: imgH,
        backgroundColor: 'black',
        marginTop: 16,
        marginLeft: 16,
        marginRight: 8,
        borderRadius: 8,
        shadowColor: '#ccc',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowRadius: 15,
        shadowOpacity: 0.6,
      };
    } else {
      return {
        width: imgW,
        height: imgH,
        backgroundColor: 'black',
        marginTop: 16,
        marginLeft: 8,
        marginRight: 16,
        borderRadius: 8,
        shadowColor: '#ccc',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowRadius: 15,
        shadowOpacity: 0.6,
      };
    }
  };

  return (
    <React.Fragment>
      <SafeAreaView style={{ height: HEIGHT }}>
        <Header mode="me" />
        <View style={styles.content}>
          <FlatList
            data={posts.posts}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            style={{ marginBottom: 36 }}
            renderItem={item => {
              return (
                <View style={{ flexDirection: 'column' }}>
                  {/* <View style={{ height: 57, width: imgW }}></View> */}
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('FLAME', {
                        postDoc: item.item.postDoc,
                        uri: item.item.uri,
                        width: item.item.width,
                        height: item.item.height,
                        thms: item.item.thms,
                        postBy: item.item.postBy,
                        postAt: item.item.postAt,
                        toDetail: false,
                      });
                    }}
                  >
                    <Card style={cardStyle(item.index)}>
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
                                <Text style={styles.text}>
                                  {item.item.poster}
                                </Text>
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

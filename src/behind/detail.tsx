/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Font from 'expo-font';
import { useTheme, Button, TextInput, Divider } from 'react-native-paper';
import {
  View,
  Button as Bt,
  FlatList,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  NavigationContext,
  useRoute,
  RouteProp,
  DrawerActions,
} from '@react-navigation/native';
import { PostedParams, NavigationParamList } from '../store/types';
import {
  PostedState,
  getParams,
  asyncGetAnss,
  DetailState,
  detailInit,
  asyncGotit,
  asyncListenGotit,
  asyncComment,
  asyncFetchComment,
  asyncGetLinks,
  // asyncGotit2,
} from '../store/behind/behind';
import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';
import { mypinModeOn } from '../store/screenMgr/mgr';
import { GetUid } from '../store/auth/auth';
import { postedImage as PostedImage } from '../components/postedImage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// import { SafeAreaView } from 'react-native-safe-area-context';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const timeLine = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const uid = useSelector(GetUid);
  const detail = useSelector(DetailState);
  const posted = useSelector(PostedState);
  const navigation = useContext(NavigationContext);
  const [com, setCom] = useState('');
  const route = useRoute<RouteProp<NavigationParamList, 'DETAIL'>>();
  const prm = route.params;
  const proportion = posted.ppram.height / posted.ppram.width;
  const doneGotitIcon = (
    gotit: boolean,
  ): 'lightbulb-outline' | 'lightbulb-on' => {
    if (gotit) {
      return 'lightbulb-on';
    } else {
      return 'lightbulb-outline';
    }
  };
  const doneNiceColor = (niced: boolean): '#00A85A' | 'white' => {
    if (niced) {
      return '#00A85A';
    } else {
      return 'white';
    }
  };
  const [focus, setFocus] = useState('link');
  const focusColor = (name: string, focus: string) => {
    if (name === focus) {
      return '#00A85A';
    } else {
      return 'gray';
    }
  };

  const styles = StyleSheet.create({
    headerBar: {
      backgroundColor: 'white',
      height: 40,
    },
    content: {
      backgroundColor: 'white',
      flex: 1,
    },
    answer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // height: 36,
      paddingTop: 9,
      paddingHorizontal: 18,
    },
    middle: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 9,
      height: 45,
      paddingBottom: 9,
      backgroundColor: 'white',
    },
    text: {
      marginTop: 4,
      color: 'white',
      // fontFamily: 'MyFont',
      fontSize: 12,
      textAlign: 'right',
    },
    link: {
      padding: 18,
      paddingTop: 6,
    },
    itemHeader: {
      flexDirection: 'row',
      marginTop: 9,
    },
    itemBody: {
      // marginTop: 8,
      marginLeft: 18,
    },
    tabMock: {
      height: 36,
    },
  });
  // const getFont = async () => {
  //   await Font.loadAsync({
  //     MyFont: require('../../assets/fonts/logotypejp_mp_b_1.1.ttf'),
  //   });
  // };

  useEffect(() => {
    dispatch(asyncFetchComment(prm.postDoc, prm.ansDoc));
    dispatch(asyncGetLinks(prm.ansDoc));
    dispatch(asyncListenGotit(prm.ansDoc, uid));
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
        <Divider />
        <ScrollView>
          <View style={styles.content}>
            <PostedImage uri={detail.dpram.uri} />

            <Text
              style={{
                paddingHorizontal: 18,
                paddingVertical: 18,
                paddingBottom: 9,
                fontSize: 12,
                fontWeight: '500',
              }}
            >
              {detail.dpram.thm}
            </Text>
            <Divider />
            <View style={styles.answer}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#00A85A',
                }}
              >
                ハンドルネームの回答
              </Text>

              <Text
                style={{
                  textAlign: 'left',
                  color: 'gray',
                  fontSize: 11,
                  fontWeight: '500',
                }}
              >
                {detail.numGotit}人が分かる！と言っています
              </Text>
            </View>
            <Text
              style={{
                paddingHorizontal: 15,
                paddingTop: 10,
                fontWeight: '500',
                fontSize: 14,
                lineHeight: 16,
                // letterSpacing: 0.1,
              }}
            >
              {detail.dpram.body}
            </Text>
            <View style={styles.middle}>
              <View style={{ marginRight: 72 }}>
                <Text
                  style={{
                    textAlign: 'left',
                    color: 'gray',
                    fontSize: 11,
                    marginTop: 24,
                  }}
                >
                  2020-03-19 20:33
                </Text>
              </View>
              <View
                style={{
                  marginRight: 10,
                  borderWidth: 4,
                  borderRadius: 100,
                  borderColor: doneNiceColor(detail.doneGotit),
                  shadowColor: 'gray',
                  shadowRadius: 4,
                  shadowOpacity: 0.4,
                  shadowOffset: {
                    height: 1,
                  },
                }}
              >
                <MaterialCommunityIcons.Button
                  name={doneGotitIcon(detail.doneGotit)}
                  color="#00A85A"
                  size={14}
                  borderRadius={100}
                  backgroundColor="white"
                  iconStyle={{
                    marginRight: 0,
                  }}
                  onPress={() => {
                    dispatch(asyncGotit(detail.dpram, uid));
                  }}
                ></MaterialCommunityIcons.Button>
              </View>
              <Button
                mode="contained"
                icon="ray-start-arrow"
                style={{
                  marginRight: 10,
                  backgroundColor: '#00A85A',
                  borderRadius: 30,
                  shadowRadius: 4,
                  shadowOpacity: 0.4,
                  shadowOffset: {
                    height: 1,
                  },
                }}
                labelStyle={{ fontWeight: 'bold' }}
                onPress={() => {
                  dispatch(mypinModeOn({}));
                  navigation.toggleDrawer();
                }}
              >
                リンクする
              </Button>
            </View>
            <View
              style={{
                flex: 1,
                marginTop: 6,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              <Button
                mode="outlined"
                style={{
                  height: 30,
                  width: 160,
                  margin: 0,
                  padding: 0,
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                  borderWidth: 2,
                  borderBottomWidth: 0,
                  borderColor: focusColor('link', focus),
                  backgroundColor: 'white',
                  borderRadius: 0,
                }}
                labelStyle={{
                  color: focusColor('link', focus),
                  margin: 0,
                  marginVertical: 8,
                  padding: 0,
                  fontSize: 12,
                }}
                onPress={() => {
                  setFocus('link');
                }}
              >
                リンク
              </Button>
              <Button
                mode="outlined"
                style={{
                  width: 160,
                  height: 30,
                  margin: 0,
                  padding: 0,
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                  borderWidth: 2,
                  borderBottomWidth: 0,
                  borderColor: focusColor('comment', focus),
                  backgroundColor: 'white',
                  // backgroundColor: '#F98A8A',
                  borderRadius: 0,
                }}
                labelStyle={{
                  color: focusColor('comment', focus),
                  margin: 0,
                  marginVertical: 8,
                  padding: 0,
                  fontSize: 12,
                }}
                onPress={() => {
                  setFocus('comment');
                }}
              >
                コメント
              </Button>
            </View>
            <View style={{ height: 2, backgroundColor: '#00A85A' }}></View>
            {focus === 'link' ? (
              <>
                <FlatList
                  data={detail.links}
                  renderItem={item => {
                    if (item.item.ansDoc === 'Header1') {
                      return (
                        <>
                          <View
                            style={{
                              flexDirection: 'row',
                              height: 30,
                              padding: 6,
                              paddingHorizontal: 18,
                              marginBottom: 4,
                            }}
                          >
                            <View
                              style={{
                                width: 24,
                                height: 24,
                                paddingTop: 2,
                                justifyContent: 'center',
                              }}
                            >
                              <MaterialCommunityIcons
                                name={item.item.icon}
                                size={20}
                                color="#F98A8A"
                              />
                            </View>
                            <Text
                              style={{
                                marginLeft: 6,
                                paddingTop: 6,
                                fontWeight: '500',
                                color: 'gray',
                              }}
                            >
                              相互にリンクしています
                            </Text>
                          </View>
                          <Divider />
                        </>
                      );
                    } else if (item.item.ansDoc === 'Header2') {
                      return (
                        <>
                          <View
                            style={{
                              flexDirection: 'row',
                              height: 30,
                              padding: 6,
                              paddingHorizontal: 18,
                              marginBottom: 4,
                            }}
                          >
                            <View
                              style={{
                                paddingTop: 2,
                                width: 24,
                                height: 24,
                                justifyContent: 'center',
                              }}
                            >
                              <MaterialCommunityIcons
                                name={item.item.icon}
                                size={20}
                                color="#F98A8A"
                              />
                            </View>
                            <Text
                              style={{
                                marginLeft: 6,
                                paddingTop: 6,
                                fontWeight: '500',
                                color: 'gray',
                              }}
                            >
                              リンクされています
                            </Text>
                          </View>
                          <Divider />
                        </>
                      );
                    } else if (item.item.ansDoc === 'Header3') {
                      return (
                        <>
                          <View
                            style={{
                              flexDirection: 'row',
                              height: 30,
                              padding: 6,
                              paddingHorizontal: 18,
                              marginBottom: 4,
                            }}
                          >
                            <View
                              style={{
                                width: 24,
                                paddingTop: 2,
                                height: 24,
                                justifyContent: 'center',
                              }}
                            >
                              <MaterialCommunityIcons
                                name={item.item.icon}
                                size={20}
                                color="#F98A8A"
                              />
                            </View>
                            <Text
                              style={{
                                marginLeft: 6,
                                paddingTop: 6,
                                fontWeight: '500',
                                color: 'gray',
                              }}
                            >
                              リンクしています
                            </Text>
                          </View>
                          <Divider />
                        </>
                      );
                    } else {
                      return (
                        <>
                          <View style={styles.link}>
                            <View style={styles.itemHeader}>
                              <Image
                                source={{ uri: item.item.uri }}
                                resizeMode="cover"
                                style={{
                                  width: 70,
                                  height: 70,
                                  borderRadius: 10,
                                }}
                              />
                              <View style={styles.itemBody}>
                                <View>
                                  <Text style={{ fontWeight: '500' }}>
                                    {item.item.thm}
                                  </Text>
                                </View>
                                <View>
                                  <Text
                                    style={{ marginTop: 9, fontWeight: '500' }}
                                  >
                                    {item.item.body}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                          <Divider />
                        </>
                      );
                    }
                  }}
                />
                <View style={styles.tabMock}></View>
              </>
            ) : (
              <>
                <TextInput
                  // style={styles.field}
                  mode="flat"
                  multiline={true}
                  value={com}
                  onChangeText={setCom}
                />
                <Button
                  onPress={() => {
                    dispatch(asyncComment(prm, com, uid));
                  }}
                >
                  コメント送信！
                </Button>
                <FlatList
                  data={detail.comments}
                  renderItem={item => <Text>{item.item.com}</Text>}
                />
                <View style={styles.tabMock}></View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  );
};

export default timeLine;

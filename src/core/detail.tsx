/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Font from 'expo-font';
import {
  useTheme,
  Button,
  TextInput,
  Divider,
  DefaultTheme,
} from 'react-native-paper';
import {
  View,
  Button as Bt,
  FlatList,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  SectionList,
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  NavigationContext,
  useRoute,
  RouteProp,
  DrawerActions,
} from '@react-navigation/native';
import { NavigationParamList } from '../store/types';
import firebase from '../../firebase/firebase';
import {
  PostedState,
  getParams,
  asyncGetAnss,
  DetailState,
  detailInit,
  asyncGotit,
  asyncComment,
  asyncFetchComment,
  asyncGetLinks,
  asyncGetMoreLinks,
  listenGotits,
  listenAns,
  listenPost,
  // asyncGotit2,
} from '../store/behind/behind';
import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';
import { mypinModeOn, cls } from '../store/screenMgr/mgr';
import { GetUid } from '../store/auth/auth';
import { postedImage as PostedImage } from '../components/postedImage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { timeExpress, asyncGetUserInfoList } from '../helper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PinItem } from '../components/pinItem';

type Props = {
  scrlRef: React.MutableRefObject<any>;
  close: boolean;
  setModal: (b: boolean) => void;
  setDAModal: (b: boolean) => void;
  setDelAns: (v: string) => void;
  setGotiters: (list: any[]) => void;
  goPosted: () => void;
  setNotFound: (b: boolean) => void;
};

export const Detail = (props: Props) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const uid = useSelector(GetUid);
  const detail = useSelector(DetailState);
  const posted = useSelector(PostedState);
  const navigation = useContext(NavigationContext);
  const [com, setCom] = useState('');
  const [mock, setMock] = useState(false);
  const [ansNotFound, setAnsNotFound] = useState(false);

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
  const [links, setLinks] = useState('mutual');
  const linkdata = () => {
    if (links === 'mutual') {
      return detail.mLinks;
    } else if (links === 'from') {
      return detail.fLinks;
    } else {
      return detail.tLinks;
    }
  };
  const focusColor = (name: string, focus: string) => {
    if (name === focus) {
      return cls.grn;
    } else {
      return 'gray';
    }
  };
  const focusColor2 = (name: string, focus: string) => {
    if (name === focus) {
      return cls.rd;
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
      paddingBottom: mock ? 280 : 0,
    },
    answer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 9,
      paddingHorizontal: 18,
      marginLeft: 8,
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
      fontSize: 12,
      textAlign: 'right',
    },
    link: {
      padding: 18,
      paddingTop: 6,
      paddingBottom: 8,
    },
    itemHeader: {
      flexDirection: 'row',
      marginTop: 9,
    },
    itemBody: {
      marginLeft: 18,
    },
    tabMock: {
      height: 36,
    },
  });

  useEffect(() => {
    if (props.close) {
      const mTime = detail.mLinks.length
        ? detail.mLinks[detail.mLinks.length - 1].linkAt
        : new firebase.firestore.Timestamp(0, 0);
      const fTime = detail.fLinks.length
        ? detail.fLinks[detail.fLinks.length - 1].linkAt
        : new firebase.firestore.Timestamp(0, 0);
      const tTime = detail.tLinks.length
        ? detail.tLinks[detail.tLinks.length - 1].linkAt
        : new firebase.firestore.Timestamp(0, 0);
      dispatch(asyncGetMoreLinks(detail.dpram.ansDoc, mTime, fTime, tTime));
    } else {
      console.log('not called more fetch');
    }
  }, [props.close]);

  useEffect(() => {
    dispatch(listenPost(detail.dpram.postDoc));
    dispatch(listenAns(detail.dpram.postDoc, detail.dpram.ansDoc));
  });

  useEffect(() => {
    dispatch(asyncFetchComment(detail.dpram.postDoc, detail.dpram.ansDoc));
    dispatch(listenGotits(detail.dpram.postDoc, detail.dpram.ansDoc, uid));
  }, [detail.dpram.ansDoc]);

  useEffect(() => {
    asyncGetUserInfoList(detail.gotitByList).then(userInfos => {
      props.setGotiters(userInfos);
    });
  }, [detail.gotitByList]);

  const _keyboardWillShow = () => {
    setMock(true);
  };

  const _keyboardDidShow = () => {
    if (props.scrlRef) {
      props.scrlRef.current.scrollTo({ x: 0, y: 360, animation: true });
    }
  };

  const _keyboardDidHide = () => {
    // props.scrlRef.current.scrollTo({ x: 0, y: 140, animation: true });
    setTimeout(() => {
      setMock(false);
    }, 0);
  };

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', _keyboardWillShow);
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardWillShow', _keyboardWillShow);
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  useEffect(() => {
    props.setNotFound(!posted.postExist);
  }, [posted.postExist]);

  useEffect(() => {
    setAnsNotFound(!detail.ansExist);
  }, [detail.ansExist]);

  return !detail.ansExist ? (
    <View
      style={{
        flex: 1,
        backgroundColor: '#DDDDDD',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontFamily: 'myfont', fontSize: 16, color: cls.grn }}>
        お探しの回答は削除されたようです。。
      </Text>
    </View>
  ) : (
    <React.Fragment>
      <View style={styles.content}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, zIndex: -100 }}
        >
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => {
                props.goPosted();
              }}
            >
              <Text
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 18,
                  paddingBottom: 9,
                  fontSize: 14,
                  fontWeight: '500',
                  marginLeft: 8,
                }}
              >
                {detail.dpram.thms[detail.dpram.order - 1]}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginRight: 2, marginTop: 2 }}
              onPress={() => {
                props.setDelAns(detail.dpram.ansDoc);
                props.setDAModal(true);
              }}
            >
              <MaterialCommunityIcons
                name="delete-forever-outline"
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <Divider />
          <View style={styles.answer}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: '#00A85A',
              }}
            >
              {detail.dpram.answer}の回答
            </Text>

            {detail.numGotit === 0 ? (
              <></>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  props.setModal(true);
                }}
              >
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
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={{
              paddingHorizontal: 18,
              paddingTop: 18,
              fontWeight: '500',
              fontSize: 18,
              lineHeight: 16,
              marginBottom: 16,
              marginLeft: 8,
              // letterSpacing: 0.1,
            }}
          >
            {detail.dpram.body}
          </Text>
          <View style={styles.middle}>
            <View style={{ marginRight: 68 }}>
              <Text
                style={{
                  textAlign: 'left',
                  color: 'gray',
                  fontSize: 11,
                  marginTop: 24,
                }}
              >
                {timeExpress(detail.dpram.ansAt)}
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
                marginRight: 15,
                backgroundColor: '#00A85A',
                borderRadius: 30,
                shadowRadius: 4,
                shadowOpacity: 0.4,
                shadowOffset: {
                  height: 1,
                },
              }}
              labelStyle={{ fontSize: 14, fontFamily: 'myfont' }}
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
                fontSize: 14,
                fontFamily: 'myfont',
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
                fontSize: 14,
                fontFamily: 'myfont',
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
              <View
                style={{
                  flex: 1,
                  marginVertical: 18,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setLinks('mutual');
                  }}
                >
                  <Text
                    style={{
                      color: focusColor2('mutual', links),
                      fontFamily: 'myfont',
                    }}
                  >
                    相互リンク
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setLinks('from');
                  }}
                >
                  <Text
                    style={{
                      color: focusColor2('from', links),
                      fontFamily: 'myfont',
                    }}
                  >
                    リンクもと
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setLinks('to');
                  }}
                >
                  <Text
                    style={{
                      color: focusColor2('to', links),
                      fontFamily: 'myfont',
                    }}
                  >
                    リンクさき
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={linkdata()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={item => {
                  const i = item.item;

                  return (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(
                            getParams({
                              postDoc: i.postDoc,
                              uri: i.uri,
                              width: i.width,
                              height: i.height,
                              postBy: i.postBy,
                              thms: i.thms,
                              postAt: i.postAt,
                            }),
                          );
                        }}
                      >
                        <PinItem
                          uri={i.uri}
                          thm={i.thms[i.order - 1]}
                          body={i.body}
                        />
                      </TouchableOpacity>
                    </>
                  );
                }}
              />
              <View style={styles.tabMock}></View>
            </>
          ) : (
            <>
              <View style={{ flex: 1 }}>
                <TextInput
                  theme={{
                    ...DefaultTheme,
                    colors: { ...DefaultTheme.colors, primary: '#00A85A' },
                  }}
                  selectionColor="#00A85A"
                  dense={true}
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
                  value={com}
                  onChangeText={setCom}
                />
                <Button
                  style={{
                    // justifyContent: 'flex-end',
                    alignSelf: 'flex-end',
                    marginRight: 18,
                    marginBottom: 9,
                    height: 30,
                    width: 64,
                    backgroundColor: '#00A85A',
                  }}
                  labelStyle={{
                    fontSize: 12,
                    color: 'white',
                    marginHorizontal: 9,
                  }}
                  onPress={() => {
                    dispatch(asyncComment(detail.dpram, com, uid));
                  }}
                >
                  送信！
                </Button>
                <Divider />
              </View>
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={detail.comments}
                renderItem={item => (
                  <>
                    <View
                      style={{
                        padding: 18,
                        paddingTop: 6,
                        paddingBottom: 8,
                      }}
                    >
                      <Text
                        style={{
                          // fontSize: 12,
                          fontWeight: '400',
                          marginTop: 8,
                          marginLeft: 4,
                        }}
                      >
                        {item.item.comBy}
                      </Text>
                      <Text style={{ padding: 10, fontWeight: '400' }}>
                        {item.item.com}
                      </Text>
                      <Text
                        style={{
                          color: 'gray',
                          fontSize: 11,
                          textAlign: 'right',
                          marginRight: 10,
                        }}
                      >
                        {timeExpress(item.item.comAt)}
                      </Text>
                    </View>
                    <Divider />
                  </>
                )}
              />
              <View style={styles.tabMock}></View>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    </React.Fragment>
  );
};

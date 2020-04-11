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
import { timeExpress } from '../helper';
import { TouchableOpacity } from 'react-native-gesture-handler';

// import { SafeAreaView } from 'react-native-safe-area-context';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

type Props = {
  scrlRef: React.MutableRefObject<any>;
  close: boolean;
  goPosted: () => void;
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

  //   const proportion = posted.ppram.height / posted.ppram.width;
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
      paddingBottom: mock ? 280 : 0,
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
      paddingBottom: 8,
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

  useEffect(() => {
    if (props.close) {
      console.log('|||||||||||||||||||||||||||||||||||||||');
    } else {
      console.log('not called more fetch');
    }
  }, [props.close]);

  useEffect(() => {
    dispatch(asyncFetchComment(detail.dpram.postDoc, detail.dpram.ansDoc));
    dispatch(asyncGetLinks(detail.dpram.ansDoc));
    dispatch(asyncListenGotit(detail.dpram.ansDoc, uid));
  }, [detail.dpram.ansDoc]);

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

  const DATA = [
    {
      title: '相互にリンクしています',
      icon: 'arrow-left-right-bold-outline',
      data: detail.mLinks,
    },
    {
      title: 'リンクされています',
      icon: 'arrow-right-bold-outline',
      data: detail.fLinks,
    },
    {
      title: 'リンクしています',
      icon: 'arrow-left-bold-outline',
      data: detail.tLinks,
    },
  ];

  return (
    <React.Fragment>
      <View style={styles.content}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, zIndex: -100 }}
        >
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
                fontSize: 12,
                fontWeight: '500',
              }}
            >
              {detail.dpram.thms[detail.dpram.order - 1]}
            </Text>
          </TouchableOpacity>

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
            <View style={{ marginRight: 68 }}>
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
                marginRight: 15,
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
              <SectionList
                sections={DATA}
                keyExtractor={(item, index) => index.toString()}
                renderItem={item => (
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
                              {item.item.thms[item.item.order - 1]}
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={{
                                marginTop: 9,
                                fontWeight: '500',
                              }}
                            >
                              {item.item.body}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <Divider />
                  </>
                )}
                renderSectionHeader={({ section: { title, icon } }) => (
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
                          name={icon}
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
                        {title}
                      </Text>
                    </View>
                    <Divider />
                  </>
                )}
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

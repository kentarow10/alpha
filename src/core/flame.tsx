/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Font from 'expo-font';
import {
  useTheme,
  Button,
  Avatar,
  FAB,
  Portal,
  Provider,
  Divider,
  Modal,
  Card,
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
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  NavigationContext,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { NavigationParamList } from '../store/types';
import firebase from '../../firebase/firebase';
import { postedImage as PostedImage } from '../components/postedImage';
import { Header } from '../components/header';
import Posted from './posted';
import { Answer } from './answer';
import { Detail } from './detail';
import { db } from '../../firebase/firebase';
import { asyncGetUserInfo, asyncGetUserInfoList } from '../helper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { cls } from '../store/screenMgr/mgr';
import posted from '../behind/posted';
import { GetUid } from '../store/auth/auth';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const useNav = () => {
  const [navState, setNavState] = useState('POSTED');
  const goAnswer = (): void => {
    setNavState('ANSWER');
  };
  const goDetail = (): void => {
    setNavState('DETAIL');
  };
  const goPosted = (): void => {
    setNavState('POSTED');
  };

  return [navState, goAnswer, goDetail, goPosted];
};

const flame = () => {
  const navigation = useContext(NavigationContext);
  const route = useRoute<RouteProp<NavigationParamList, 'FLAME'>>();
  const prm = route.params;
  const uid = useSelector(GetUid);
  const [showModal, setModal] = useState(false);
  const scrl = useRef(null);
  const [close, setClose] = useState(false);
  const [userInfo, setUserInfo] = useState({ iconUri: '', userName: '' });
  const [nicers, setNicers] = useState([]);
  const [gotiters, setGotiters] = useState([]);
  const [navState, setNavState] = useState(prm.toDetail ? 'DETAIL' : 'POSTED');
  const modalTitle = () => {
    if (navState === 'DETAIL') {
      return '分かる！したユーザー';
    } else {
      return 'いいね！したユーザー';
    }
  };
  const modalData = () => {
    if (navState === 'DETAIL') {
      return gotiters;
    } else {
      return nicers;
    }
  };
  const goAnswer = (): void => {
    setNavState('ANSWER');
  };
  const goDetail = (): void => {
    setNavState('DETAIL');
  };
  const goPosted = (): void => {
    setNavState('POSTED');
  };
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;

    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  const deletablePost = () => {
    if (uid === prm.postBy) {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    asyncGetUserInfo(prm.postBy).then(res => {
      setUserInfo({ iconUri: res.uri, userName: res.name });
    });
  }, []);

  return (
    <React.Fragment>
      <SafeAreaView style={{ height: HEIGHT }}>
        <Header mode="back" />
        <Divider />
        <ScrollView
          ref={scrl}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              console.log('closing...');
              setClose(true);
            } else {
              setClose(false);
            }
          }}
          scrollEventThrottle={400}
        >
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: 'white' }}>
              <PostedImage
                uri={prm.uri}
                iconUri={userInfo.iconUri}
                userName={userInfo.userName}
                deletable={deletablePost()}
              />
              {navState === 'POSTED' ? (
                <Posted
                  postDoc={prm.postDoc}
                  uri={prm.uri}
                  width={prm.width}
                  height={prm.height}
                  postBy={prm.postBy}
                  thms={prm.thms}
                  postAt={prm.postAt}
                  close={close}
                  setModal={setModal}
                  setNicers={setNicers}
                  goAnswer={goAnswer}
                  goDetail={goDetail}
                />
              ) : navState === 'ANSWER' ? (
                <Answer scrlRef={scrl} goPosted={goPosted} />
              ) : (
                <Detail
                  scrlRef={scrl}
                  goPosted={goPosted}
                  close={close}
                  setModal={setModal}
                  setGotiters={setGotiters}
                />
              )}
            </View>
            <View style={{ height: 37 }}></View>
          </View>
        </ScrollView>
        <Provider>
          <Portal>
            <Modal
              visible={showModal}
              onDismiss={() => {
                setModal(false);
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => {
                    setModal(false);
                  }}
                  style={{
                    height: HEIGHT - 140,
                    width: (WIDTH - 300) / 2,
                    backgroundColor: 'transparent',
                  }}
                ></TouchableOpacity>
                <View
                  style={{
                    height: HEIGHT - 140,
                    width: 300,
                    backgroundColor: '#DDDDDD',
                    borderRadius: 8,
                  }}
                >
                  <View
                    style={{
                      height: 64,
                      backgroundColor: cls.grn,
                      borderRadius: 8,
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'myfont',
                        fontSize: 22,
                        textAlign: 'center',
                        color: 'white',
                      }}
                    >
                      {modalTitle()}
                    </Text>
                  </View>
                  <FlatList
                    data={modalData()}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={item => (
                      <View
                        style={{
                          height: 64,
                          backgroundColor: 'white',
                          borderRadius: 8,
                          marginTop: 2,
                          marginHorizontal: 1,
                        }}
                      >
                        <View style={{ flexDirection: 'row', height: 64 }}>
                          <View
                            style={{
                              marginLeft: 24,
                              marginHorizontal: 10,
                              alignSelf: 'center',
                              borderRadius: 13,
                              width: 44,
                              height: 44,
                            }}
                          >
                            <Image
                              source={{
                                uri: item.item.uri,
                              }}
                              // size={40}
                              style={{
                                width: 44,
                                height: 44,
                                borderWidth: 2,
                                borderRadius: 13,
                                borderColor: '#DDDDDD',
                                backgroundColor: '#DDDDDD',
                                // borderWidth: 2,
                              }}
                            />
                          </View>

                          <View
                            style={{
                              padding: 16,
                              marginTop: 10,
                            }}
                          >
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                              {item.item.name}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setModal(false);
                  }}
                  style={{
                    height: HEIGHT - 140,
                    width: (WIDTH - 300) / 2,
                    backgroundColor: 'transparent',
                  }}
                ></TouchableOpacity>
              </View>
            </Modal>
          </Portal>
        </Provider>
      </SafeAreaView>
    </React.Fragment>
  );
};

export default flame;

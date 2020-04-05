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
import { postedImage as PostedImage } from '../components/postedImage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../components/header';
import { cls } from '../store/screenMgr/mgr';

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
  const [showAns, setAnss] = useState(false);
  const [showModal, setModal] = useState(false);
  const doneNiceColor = (niced: boolean): '#00A85A' | 'white' => {
    if (niced) {
      return '#00A85A';
    } else {
      return 'white';
    }
  };
  const doneNiceIcon = (niced: boolean): 'thumb-up' | 'thumb-up-outline' => {
    if (niced) {
      return 'thumb-up';
    } else {
      return 'thumb-up-outline';
    }
  };

  const styles = StyleSheet.create({
    headerBar: {
      backgroundColor: 'white',
      height: 40,
    },
    content: {
      backgroundColor: 'white',
      flex: 12,
    },
    avatar: {
      marginHorizontal: 10,
      alignSelf: 'center',
    },
    owner: {
      flex: 0.7,
      flexDirection: 'row',
      height: 75,
    },
    names: {
      padding: 16,
    },
    text: {
      marginTop: 4,
      color: 'white',
      // fontFamily: 'MyFont',
      fontSize: 12,
      textAlign: 'right',
    },
    middle: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      height: 45,
      paddingBottom: 9,
      backgroundColor: 'white',
    },
    actionBox: {
      flex: 27,
    },
    ansBtn: {
      // flex: 1,
      width: WIDTH / 4,
      height: WIDTH / 10,
      // marginBottom: 8,
      // marginRight: 16,
      marginLeft: 16,
      // marginHorizontal: 20,
      backgroundColor: '#00A85A',
      // alignContent: 'center',
    },
    niceBtn: {
      // backgroundColor: '#00A85A',
      width: WIDTH / 4,
      height: WIDTH / 10,
      alignContent: 'center',
      marginRight: 44,
      marginLeft: 16,
      marginBottom: 8,
      borderColor: doneNiceColor(posted.doneNice),
      borderWidth: 3,
      borderRadius: 8,
      // color: 'red',
    },
    upRow: {
      flexDirection: 'row',
      flex: 2,
    },
    niceBox: {
      // flex: 1,
      width: WIDTH / 2,
      flexDirection: 'column',
    },
    downRow: {
      height: 27,
      marginTop: 9,
      zIndex: 2,
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
    const unsubscribe = navigation.addListener('focus', () => {
      setOrder(1);
      setAnss(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    dispatch(asyncListenNice(prm.postDoc, uid));

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

  const renderHeader = () => {
    return (
      <>
        <PostedImage uri={posted.ppram.uri} />
        <View>
          <ThmSwitch
            thm={posted.ppram.thms}
            order={order}
            setOrder={setOrder}
            setModal={setModal}
            postAt={posted.ppram.createdAt}
            numNice={posted.ppram.numNice}
          />
        </View>
        <View style={styles.middle}>
          <View
            style={{
              marginRight: 10,
              borderWidth: 4,
              borderRadius: 100,
              borderColor: doneNiceColor(posted.doneNice),
              shadowColor: 'gray',
              shadowRadius: 4,
              shadowOpacity: 0.4,
              shadowOffset: {
                height: 1,
              },
            }}
          >
            <MaterialCommunityIcons.Button
              name={doneNiceIcon(posted.doneNice)}
              color="#00A85A"
              size={14}
              borderRadius={100}
              backgroundColor="white"
              iconStyle={{
                marginRight: 0,
              }}
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
            ></MaterialCommunityIcons.Button>
          </View>
          <Button
            mode="contained"
            icon="hand"
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
              navigation.navigate('ANSWER');
            }}
          >
            答える
          </Button>
        </View>
        <View style={styles.downRow}>
          <Button
            mode="outlined"
            style={{
              height: 30,
              margin: 0,
              padding: 0,
              backgroundColor: cls.grn,
              borderRadius: 0,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              shadowColor: 'gray',
              shadowRadius: 4,
              shadowOpacity: 0.4,
              shadowOffset: {
                height: -2,
              },
            }}
            labelStyle={{
              color: 'white',
              margin: 0,
              marginVertical: 5,
              marginTop: 8,
              padding: 0,
              fontSize: 12,
              textAlignVertical: 'bottom',
            }}
            onPress={() => {
              if (showAns) {
                setAnss(false);
              } else {
                setAnss(true);
              }
            }}
          >
            みんなの回答をみる
          </Button>
        </View>
      </>
    );
  };

  return (
    <React.Fragment>
      <SafeAreaView style={{ height: HEIGHT }}>
        <Header mode="back" />
        <Divider />
        <View style={styles.content}>
          <View style={{ backgroundColor: 'white' }}>
            <FlatList
              // style={{ height: 60 }}
              // stickyHeaderIndices={[0]}
              ListHeaderComponent={renderHeader}
              data={posted.anss}
              // onRefresh={() => {
              //   dispatch(asyncGetAnss(prm.postDoc));
              // }}
              // refreshing={posted.isFetching}
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
                    <View
                      style={{
                        flex: 1,
                        paddingVertical: 15,
                        paddingHorizontal: 35,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '500',
                          marginTop: 2,
                        }}
                      >
                        {item.item.body}
                      </Text>
                      <Text
                        style={{
                          marginTop: 5,
                          textAlign: 'right',
                          fontSize: 11,
                          color: 'gray',
                        }}
                      >
                        {item.item.ansBy}
                      </Text>
                    </View>
                    <Divider />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <View style={styles.tabMock}></View>
        </View>
        <Provider>
          <Portal>
            <Modal
              visible={showModal}
              onDismiss={() => {
                setModal(false);
              }}
            >
              <View style={{ height: 300, width: 300, backgroundColor: 'red' }}>
                <Text>Example Modal</Text>
              </View>
            </Modal>
          </Portal>
        </Provider>
      </SafeAreaView>
    </React.Fragment>
  );
};

export default posted;

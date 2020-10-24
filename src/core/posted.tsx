/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme, Button, Divider, Modal } from 'react-native-paper';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { NavigationContext } from '@react-navigation/native';
import {
  PostedState,
  getParams,
  asyncGetAnss,
  asyncNice,
  detailInit,
  asyncGetMoreAnss,
  listenNices,
  listenPost,
} from '../store/behind/behind';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GetUid } from '../store/auth/auth';
import { thmSwitch as ThmSwitch } from '../components/thmSwitch';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cls } from '../store/screenMgr/mgr';
import { asyncGetUserInfoList } from '../helper';

const WIDTH = Dimensions.get('window').width;

type Props = {
  postDoc: string;
  uri: string;
  width: number;
  height: number;
  postBy: string;
  thms: string[];
  postAt: firebase.firestore.Timestamp;
  setModal: (b: boolean) => void;
  setNicers: (list: any[]) => void;
  setNotFound: (b: boolean) => void;
  close: boolean;
  goAnswer: () => void;
  goDetail: () => void;
};

const Posted = (props: Props) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const navigation = useContext(NavigationContext);
  const posted = useSelector(PostedState);
  const uid = useSelector(GetUid);
  const [order, setOrder] = useState(1);
  const [showAns, setAnss] = useState(false);
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
  const anss = () => {
    if (order === 1) {
      return posted.anss1;
    } else if (order === 2) {
      return posted.anss2;
    } else {
      return posted.anss3;
    }
  };

  const styles = StyleSheet.create({
    text: {
      marginTop: 4,
      color: 'white',
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
      width: WIDTH / 4,
      height: WIDTH / 10,
      marginLeft: 16,
      backgroundColor: '#00A85A',
    },
    niceBtn: {
      width: WIDTH / 4,
      height: WIDTH / 10,
      alignContent: 'center',
      marginRight: 44,
      marginLeft: 16,
      marginBottom: 8,
      borderColor: doneNiceColor(posted.doneNice),
      borderWidth: 3,
      borderRadius: 8,
    },
    upRow: {
      flexDirection: 'row',
      flex: 2,
    },
    niceBox: {
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

  useEffect(() => {
    if (props.close) {
      console.log('|||||||||||||||||||||||||||||||||||||||');
      if (order === 1) {
        posted.anss1.length &&
          dispatch(
            asyncGetMoreAnss(
              posted.ppram.postDoc,
              1,
              posted.anss1[posted.anss1.length - 1].ansAt,
            ),
          );
      } else if (order === 2) {
        posted.anss2.length &&
          dispatch(
            asyncGetMoreAnss(
              posted.ppram.postDoc,
              2,
              posted.anss2[posted.anss2.length - 1].ansAt,
            ),
          );
      } else {
        posted.anss3.length &&
          dispatch(
            asyncGetMoreAnss(
              posted.ppram.postDoc,
              3,
              posted.anss3[posted.anss3.length - 1].ansAt,
            ),
          );
      }
    } else {
      console.log('not called more fetch');
    }
  }, [props.close]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setOrder(1);
      setAnss(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    dispatch(listenNices(props.postDoc, uid));
    dispatch(
      getParams({
        postDoc: props.postDoc,
        uri: props.uri,
        width: props.width,
        height: props.height,
        postBy: props.postBy,
        thms: props.thms,
        postAt: props.postAt,
      }),
    );
  }, []);

  useEffect(() => {
    dispatch(asyncGetAnss(props.postDoc));
  }, [posted.ppram.postDoc]);

  useEffect(() => {
    asyncGetUserInfoList(posted.ppram.niceByList).then(userInfos => {
      props.setNicers(userInfos);
    });
  }, [posted.ppram.niceByList]);

  useEffect(() => {
    dispatch(listenPost(props.postDoc));
  });

  useEffect(() => {
    props.setNotFound(!posted.postExist);
  }, [posted.postExist]);

  return (
    <React.Fragment>
      <View>
        <ThmSwitch
          thm={posted.ppram.thms}
          order={order}
          setOrder={setOrder}
          setModal={props.setModal}
          postAt={posted.ppram.postAt}
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
                  posted.ppram.width,
                  posted.ppram.height,
                  posted.ppram.thms,
                  posted.ppram.postBy,
                  posted.ppram.postAt,
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
            props.goAnswer();
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
      <FlatList
        data={anss()}
        // onEndReachedThreshold={0}
        // onEndReached={onEndReached}
        keyExtractor={(item, index) => index.toString()}
        renderItem={item => {
          if (!showAns) {
            return null;
          }

          return (
            <TouchableOpacity
              onPress={() => {
                dispatch(
                  detailInit({
                    postDoc: posted.ppram.postDoc,
                    ansDoc: item.item.ansDoc,
                    uri: posted.ppram.uri,
                    width: posted.ppram.width,
                    height: posted.ppram.height,
                    thms: posted.ppram.thms,
                    order: item.item.order,
                    body: item.item.body,
                    numNice: posted.ppram.numNice,
                    postBy: posted.ppram.postBy,
                    ansBy: item.item.ansBy,
                    postAt: posted.ppram.postAt,
                    ansAt: item.item.ansAt,
                    answer: item.item.answer,
                  }),
                );
                props.goDetail();
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
                    fontWeight: '600',
                    color: 'gray',
                  }}
                >
                  {item.item.answer}
                </Text>
              </View>
              <Divider />
            </TouchableOpacity>
          );
        }}
      />
    </React.Fragment>
  );
};

export default Posted;

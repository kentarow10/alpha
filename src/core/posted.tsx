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
  detailInit,
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

type Props = {
  postDoc: string;
  uri: string;
  width: number;
  height: number;
  owner: string;
  thms: string[];
  createdAt: Date;
  setModal: (b: boolean) => void;
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
    const unsubscribe = navigation.addListener('focus', () => {
      setOrder(1);
      setAnss(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    dispatch(asyncListenNice(props.postDoc, uid));

    dispatch(
      getParams({
        postDoc: props.postDoc,
        uri: props.uri,
        width: props.width,
        height: props.height,
        owner: props.owner,
        thms: props.thms,
        createdAt: props.createdAt,
      }),
    );
  }, []);

  useEffect(() => {
    dispatch(asyncGetAnss(props.postDoc));
  }, [posted.ppram.postDoc]);

  return (
    <React.Fragment>
      <View>
        <ThmSwitch
          thm={posted.ppram.thms}
          order={order}
          setOrder={setOrder}
          setModal={props.setModal}
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
        data={posted.anss}
        keyExtractor={(item, index) => index.toString()}
        renderItem={item => {
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
                    thm: posted.ppram.thms[item.item.orderThm - 1],
                    body: item.item.body,
                    numNice: posted.ppram.numNice,
                    postedBy: posted.ppram.owner,
                    ansBy: item.item.ansBy,
                    postedAt: posted.ppram.createdAt,
                    ansAt: item.item.ansAt,
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
    </React.Fragment>
  );
};

export default Posted;

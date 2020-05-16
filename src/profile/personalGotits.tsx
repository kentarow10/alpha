/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  FlatList,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  NavigationContext,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { Header } from '../components/header';
import { NavigationParamList } from '../store/types';
import { GetAllMe } from '../store/me/me';
import { GetAllPerson } from '../store/person/person';
import { PinItem } from '../components/pinItem';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const imgW = (WIDTH - 48) / 2;
const imgH = imgW * 1.414;

export const PersonalGotits = () => {
  const navigation = useContext(NavigationContext);
  const route = useRoute<RouteProp<NavigationParamList, 'PPOST'>>();
  const prm = route.params;
  const me = useSelector(GetAllMe);
  const person = useSelector(GetAllPerson);
  const data = () => {
    if (prm.notMe) {
      return person.myGotitPins;
    } else {
      return me.myGotitPins;
    }
  };

  const styles = StyleSheet.create({
    img: {
      width: imgW,
      height: imgH,
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

  return (
    <React.Fragment>
      <SafeAreaView style={{ height: HEIGHT }}>
        <Header mode="back" />
        <View style={styles.content}>
          <FlatList
            data={data()}
            keyExtractor={(item, index) => index.toString()}
            numColumns={1}
            style={{ marginBottom: 36 }}
            renderItem={item => {
              return (
                <View style={{ flexDirection: 'column' }}>
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
                        toDetail: true,
                      });
                    }}
                  >
                    <PinItem
                      uri={item.item.uri}
                      thm={item.item.thms[item.item.order - 1]}
                      body={item.item.body}
                    />
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

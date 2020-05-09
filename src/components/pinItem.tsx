import React, { useState, useMemo, useEffect } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { cls } from '../store/screenMgr/mgr';
import { stringOmitter } from '../helper';
import { Divider } from 'react-native-paper';

type SampleProps = {
  uri: string;
  thm: string;
  body: string;
  sideColor?: string;
};

export const PinItem = (props: SampleProps) => {
  const cl = props.sideColor || cls.grn;

  return (
    <>
      <View
        style={{
          marginBottom: 7,
          borderLeftColor: cl,
          borderLeftWidth: 4,
          borderRadius: 3,
          marginLeft: 6,
          backgroundColor: 'white',
          shadowColor: 'gray',
          shadowRadius: 3,
          shadowOpacity: 0.1,
          shadowOffset: {
            height: 1,
          },
        }}
      >
        <Divider />
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: props.uri }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 10,
              margin: 8,
            }}
          />
          <View
            style={{
              height: 60,
              marginVertical: 8,
              flex: 1,
              padding: 8,
            }}
          >
            <Text style={{ fontWeight: '500', fontSize: 14 }}>
              {stringOmitter(25, props.thm)}
            </Text>
          </View>
        </View>
        <Divider />
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <Text style={{ fontWeight: '500', fontSize: 14 }}>
            {stringOmitter(40, props.body)}
          </Text>
        </View>
      </View>
    </>
  );
};

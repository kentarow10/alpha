import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { cls } from '../store/screenMgr/mgr';

type SampleProps = {
  bc?: string;
  marginBottom?: number;
};

export const Indicator = (props: SampleProps) => {
  const bc = props.bc || '#EEEEEE';
  const mb = props.marginBottom || 24;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bc,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator
        animating={true}
        color={cls.grn}
        size="large"
        style={{ marginBottom: mb }}
      />
      <Text style={{ fontWeight: '400' }}>少々お待ちください...</Text>
    </View>
  );
};

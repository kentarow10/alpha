import React, { useState, useMemo, useEffect } from 'react';
import { Text } from 'react-native';

type SampleProps = {
  text: string;
};

export const Ftext = (props: SampleProps) => {
  return <Text style={{ fontFamily: 'myfont' }}>{props.text}</Text>;
};

import React, { useState, useMemo, useEffect } from 'react';
import { Text } from 'react-native';

type SampleProps = {
  text: string;
};

export const Tegaki = (props: SampleProps) => {
  return <Text style={{ fontFamily: 'tegaki' }}>{props.text}</Text>;
};

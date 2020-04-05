import React, { useState, useMemo } from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet, View, Text, Image } from 'react-native';
import _ from 'lodash';

type SampleProps = {
  uri: string;
};

export class Img extends React.Component<SampleProps> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps);
    console.log('nextProps');

    const propsDiff = _.isEqual(nextProps, this.props);

    return true;
    // return !propsDiff;
  }

  render() {
    console.log('running!!!!!!');

    return (
      <Image
        source={{ uri: this.props.uri }}
        resizeMode="contain"
        style={{ flex: 1, backgroundColor: 'black' }}
      />
    );
  }
}

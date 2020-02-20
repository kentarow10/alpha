import React from 'react';
import { Image, Text, View } from 'react-native';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';

import Main from './train/t_main';

export default class App extends React.Component {
  state = {
    isReady: false,
  };

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return <Main />;
  }

  async _cacheResourcesAsync() {
    const images = [require('./assets/aaa.jpg')];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });

    return Promise.all(cacheImages);
  }
}

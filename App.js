/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {Root, StyleProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';

import {StateProvider} from './components/MemoryStore';
import Navigator from './components/Navigator';
import getTheme from './native-base-theme/components';
import ironPlatform from './native-base-theme/variables/ironPlatform';

const App: () => React$Node = () => {
  return (
    <StateProvider>
      <NavigationContainer>
        <StyleProvider style={getTheme(ironPlatform)}>
          <Root>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{backgroundColor: '#296394'}} />
            <Navigator />
          </Root>
        </StyleProvider>
      </NavigationContainer>
    </StateProvider>
  );
};

export default App;

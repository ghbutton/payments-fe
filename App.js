/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, {useContext, useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, StatusBar, View} from 'react-native';
import {Root} from 'native-base';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';

import {StateProvider} from './components/Store';
import Navigator from './components/Navigator';

const App: () => React$Node = () => {
  return (
    <StateProvider>
      <NavigationContainer>
        <Root>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView></SafeAreaView>
          <Navigator />
        </Root>
      </NavigationContainer>
    </StateProvider>
  );
};

export default App;

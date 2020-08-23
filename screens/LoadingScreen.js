import React, {useContext, useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Api from '../Api';

import {StateProvider, Store} from '../components/Store';

const logo = require('../static/images/icon.png');
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
  },
});

export default function LoadingScreen() {
  const {state, dispatch} = useContext(Store);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Api.ping();
      console.log(dispatch);
      dispatch({type: "LOG_OUT"});
    };

    fetchData();
  });

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />
    </View>
  );
}

import React, {useContext, useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {StateProvider, Context} from '../components/MemoryStore';
import DiskStore from '../components/DiskStore';
import Api from 'components/Api';

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
  const {state, dispatch} = useContext(Context);

  useEffect(() => {
    const fetch = async () => {
      const sessionToken = await DiskStore.getData("sessionToken");
      if (sessionToken) {
        dispatch({type: "LOG_IN"});
      } else {
        dispatch({type: "LOG_OUT"});
      }
    }
    fetch();
  }, []);

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />
    </View>
  );
}

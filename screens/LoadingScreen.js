import React, {useContext, useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {Context} from '../components/MemoryStore';
import DiskStore from '../components/DiskStore';
import Api from '../components/Api';
import Utils from '../components/Utils';


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
  const {dispatch} = useContext(Context);

  useEffect(() => {
    const fetch = async () => {
      const session = await DiskStore.getData("session");
      let sessionToken = await DiskStore.getData("sessionToken");

      if (!sessionToken) {
        dispatch({type: "LOG_OUT"});
        return;
      }

      const versionResponse = await Api.checkApiVersion();
      if (versionResponse !== "ok") {
        dispatch({type: "OUTDATED"});
        return;
      }

      const response = await Api.checkSessionToken(sessionToken, session.data.id);
      if (response.status === 401) {
        await Utils.createTokenFromSession(session);
        sessionToken = await DiskStore.getData("sessionToken");
      }

      if (sessionToken) {
        dispatch({type: "LOG_IN", token: sessionToken});
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

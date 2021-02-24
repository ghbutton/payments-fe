import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Form, Item, Input, Label, Text} from 'native-base';
import {RNCamera} from 'react-native-camera';
import {get} from 'lodash';

import Url from '../components/Url';
import Api from '../components/Api';
import Money from '../components/Money';
import {Context} from '../components/MemoryStore';

export default function PayScreen() {
  const {state} = useContext(Context);
  const [paymentState, setPaymentState] = useState('unclaimed');
  const [claimedTransaction, setClaimedTransaction] = useState(null);
  const [pendingTransactionId, setPendingTransactionId] = useState(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black',
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    },
  });

  const finishPayment = async () => {
    const response = await Api.finishPendingUserTransaction(
      state.sessionToken,
      pendingTransactionId,
    );
    console.log(response);
  };

  const resetState = async () => {
    setPaymentState('unclaimed');
    setClaimedTransaction(null);
    setPendingTransactionId(null);
  };

  const onCancel = async () => {
    resetState();
  };

  const payVersion1 = async (params) => {
    const response = await Api.claimPendingUserTransaction(
      state.sessionToken,
      params.pending_id,
      params.secret,
    );
    if (response && response.data.type === 'pending_user_transactions') {
      setClaimedTransaction(response);
      setPaymentState('claimed');
    } else {
      setPaymentState('unclaimed');
    }
  };

  const onPayUrl = async (url) => {
    const params = Url.queryParams(url);
    await setPaymentState('claiming');
    await setPendingTransactionId(params.pending_id);
    if (params.version === '1') {
      payVersion1(params);
    }
  };

  const unclaimedState = () => (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        onBarCodeRead={(code) => {
          const urlString = get(code, 'data');
          onPayUrl(urlString);
        }}
        captureAudio={false}
      />
    </View>
  );

  const claimingState = () => (
    <View>
      <Text>Claiming</Text>
    </View>
  );

  const claimedState = () => (
    <View>
      <Form>
        <Item>
          <Label>Amount</Label>
          <Input
            placeholder={Money.stringAmount(
              claimedTransaction.data.attributes.amount,
              claimedTransaction.data.attributes.currency,
            )}
            disabled
          />
        </Item>
        <Item>
          <Label>Currency</Label>
          <Input placeholder="USD" disabled />
        </Item>
        <Button block primary onPress={finishPayment}>
          <Text>Pay</Text>
        </Button>
        <Button block error onPress={onCancel}>
          <Text>Cancel</Text>
        </Button>
      </Form>
    </View>
  );

  if (paymentState === 'unclaimed') {
    return unclaimedState();
  } else if (paymentState === 'claiming') {
    return claimingState();
  } else if (paymentState === 'claimed') {
    return claimedState();
  }
}

import React, {useContext, useEffect, useState} from 'react';
import QRCode from 'react-native-qrcode-svg';
import { Button, Form, Item, Input, Label, Text } from 'native-base';
import {get} from 'lodash';

import Api from '../components/Api';
import Money from '../components/Money';
import {Context} from '../components/MemoryStore';

export default function ReceiveScreen() {
  const {state} = useContext(Context);
  const currency = "USDC";
  const [submitted, setSubmitted] = useState(false);
  const [amount, setAmount] = useState(0);
  const [secret, setSecret] = useState(null);
  const [pendingId, setPendingId] = useState(null);

  const handleAmountChange = (value) => {
    const [dollar, cents] = value.split(".");
    const leadingCents = (cents || "0").substring(0, 2);
    // Ugh I can believe you can add strings to numbers if you wanted to
    // javascript is annoying
    setAmount((Number(dollar) * 100) + Number(leadingCents))
  }
  const submit = async () => {
    const response = await Api.createPendingUserTransaction(state.sessionToken, currency, amount);
    const attributes = get(response, "data.attributes");
    const pendingId = get(response, "data.id");

    if (attributes && attributes.currency === currency && attributes.status === "unclaimed" && pendingId) {
      setSubmitted(true);
      setAmount(attributes.amount);
      setSecret(attributes.secret);
      setPendingId(pendingId);
    }
  }

  const showForm = () => {
    return (
      <Form>
        <Item>
          <Label>Amount</Label>
          <Input keyboardType="numeric" placeholder="0" onChangeText={handleAmountChange} />
        </Item>
        <Item>
          <Label>Currency</Label>
          <Input placeholder="USD" disabled />
        </Item>
        <Button block primary onPress={submit}>
          <Text>Ready</Text>
        </Button>
      </Form>
    )
  }
  const showQr = () => {
    return (<>
    <Text>Amount: {Money.format(amount, currency)}</Text>
    <QRCode
      value={`https://www.ironnotice.com/app/receive?currency=${currency}&amount=${amount}&secret=${secret}&pending_id=${pendingId}&version=1`}
      size={300}
    />
  </>)
  }

  return submitted ? showQr() : showForm();
}

import React, {useContext, useEffect, useState } from 'react';
import {Keyboard} from 'react-native';
import {
  Button,
  Content,
  Form,
  Item,
  Input,
  Text,
} from 'native-base';
import Api from '../components/Api';
import {Context} from '../components/MemoryStore';

export default function LoginScreen({navigation}) {
  const {dispatch} = useContext(Context);
  const [email, setEmail] = useState("");
  const handleEmailChange = (value) => { setEmail(value) }

  const [password, setPassword] = useState("");
  const handlePasswordChange = (value) => { setPassword(value) }

  const [otpToken, setOtpToken] = useState("");
  const handleOtpTokenChange = (value) => { setOtpToken(value) }

  const submit = async () => {
    const session = await Api.createSession(email, password, otpToken);
    if (session && session.data && session.data.attributes) {
      await DiskStore.setData("session", session);
      const token = await Api.createToken(session.data.id, session.data.attributes.secret, Math.floor(Date.now() / 1000));
      if (token && token.data && token.data.attributes) {
        await DiskStore.setData("sessionToken", token.data.attributes.token)
        dispatch({type: "LOG_IN", token: token.data.attributes.token});
      }
    }
  }

  const createAccount = async () => {
    navigation.navigate("CreateAccountScreen")
  }

  return (
    <Content>
      <Form>
        <Item>
          <Input placeholder="Email" value={email} onChangeText={handleEmailChange} autoCompleteType="email" keyboardType="email-address" textContentType="emailAddress" autoCapitalize="none" />
        </Item>
        <Item last>
          <Input placeholder="Password" value={password} onChangeText={handlePasswordChange} secureTextEntry={true} textContentType="password" autoCompleteType="password" autoCapitalize="none" />
        </Item>
        <Item last>
          <Input placeholder="One Time Password" value={otpToken} onChangeText={handleOtpTokenChange} keyboardType="number-pad" />
        </Item>
        <Button block primary onPress={submit}>
          <Text>Submit</Text>
        </Button>
      </Form>
      <Text>or</Text>
      <Button block success onPress={createAccount}>
        <Text>Create Account</Text>
      </Button>
    </Content>
  )
}

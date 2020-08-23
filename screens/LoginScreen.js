import React, {useState, useEffect} from 'react';
import {Keyboard} from 'react-native';
import {
  Button,
  Content,
  Form,
  Item,
  Input,
  Text,
} from 'native-base';
import Api from '../Api';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const handleEmailChange = (value) => { setEmail(value) }

  const [password, setPassword] = useState("");
  const handlePasswordChange = (value) => { setPassword(value) }

  const submit = async () => {
    const result = await Api.getUserByEmailAndPassword(email, password);
    if (result.data.length > 0) {
    } else {
    }
  }

  return (
    <Content>
      <Form>
        <Item>
          <Input placeholder="Email" onBlur={Keyboard.dismiss} value={email} onChangeText={handleEmailChange} autoCompleteType="email" keyboardType="email-address" textContentType="emailAddress" autoCapitalize="none" />
        </Item>
        <Item last>
          <Input placeholder="Password"onBlur={Keyboard.dismiss} value={password} onChangeText={handlePasswordChange} secureTextEntry={true} textContentType="password" autoCompleteType="password" autoCapitalize="none" />
        </Item>
        <Button block primary onPress={submit}>
          <Text>Submit</Text>
        </Button>
      </Form>
    </Content>
  )
}

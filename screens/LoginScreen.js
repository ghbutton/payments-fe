import React, {useContext, useEffect, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {Button, Content, Form, Item, Input, Text} from 'native-base';
import Api from '../components/Api';
import Utils from '../components/Utils';
import {Context} from '../components/MemoryStore';

export default function LoginScreen({navigation}) {
  const {dispatch} = useContext(Context);
  const [email, setEmail] = useState('');
  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const [password, setPassword] = useState('');
  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const [error, setError] = useState('');

  const submit = async () => {
    const token = await Utils.createSessionAndToken(email, password);
    if (token) {
      dispatch({type: 'LOG_IN', token: token});
    } else {
      setError('Could not login, please check credentials');
    }
  };

  const createAccount = async () => {
    navigation.navigate('CreateAccountScreen');
  };

  return (
    <Content padder>
      <Form>
        <Item>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
            autoCompleteType="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Item>
        <Item last>
          <Input
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={true}
            textContentType="password"
            autoCompleteType="password"
            autoCapitalize="none"
          />
        </Item>
        <View style={{paddingTop: 15}}>
          {error !== '' && (
            <Text style={{fontSize: 12, fontWeight: 'bold', color: 'red'}}>
              {error}
            </Text>
          )}
          <Button block primary onPress={submit}>
            <Text>Submit</Text>
          </Button>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{}}>or</Text>
          </View>

          <Button block success onPress={createAccount}>
            <Text>Create Account</Text>
          </Button>
        </View>
      </Form>
    </Content>
  );
}

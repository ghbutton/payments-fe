import React, {useContext, useState, useEffect} from 'react';
import {Linking, Keyboard} from 'react-native';
import {
  Button,
  Content,
  Form,
  Item,
  Input,
  Text,
} from 'native-base';

import Api from '../components/Api';
import DiskStore from '../components/DiskStore';
import {Context} from '../components/MemoryStore';

export default function CreateAccountScreen({navigation}) {
  const {dispatch} = useContext(Context);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const handleEmailChange = (value) => { setEmail(value) }

  const [password, setPassword] = useState("");
  const handlePasswordChange = (value) => { setPassword(value) }

  const [firstName, setFirstName] = useState("");
  const handleFirstNameChange = (value) => { setFirstName(value) }

  const [lastName, setLastName] = useState("");
  const handleLastNameChange = (value) => { setLastName(value) }

  const [otpToken, setOtpToken] = useState("");
  const handleOtpTokenChange = (value) => { setOtpToken(value) }

  const [otp, setOtp] = useState(null);

  useEffect(() => {
    const call = async () => {
      const otpApi = await Api.createOneTimePassword();
      if (otpApi.data.id) {
        setLoading(false);
        setOtp(otpApi);
      }
    }

    call();
  }, []);

  const linkToOtp = async () => {
    await Linking.openURL(`otpauth://totp/Iron_Payments%3A${encodeURIComponent(email)}?secret=${otp.data.attributes.secret}&issuer=Iron`);
  }

  const submit = async () => {
    const user = await Api.createUser(email, password, otp, otpToken, firstName, lastName);
    if (user.meta && user.meta.session_token) {
      await DiskStore.setData("sessionToken", user.meta.session_token);
      dispatch({type: "LOG_IN", token: user.meta.session_token});
    }
  }

  if (loading) {
    return null;
  } else {
    return (
      <Content>
        <Form>
          <Item>
            <Input placeholder="First Name" value={firstName} onChangeText={handleFirstNameChange} />
          </Item>
          <Item>
            <Input placeholder="Last Name" value={lastName} onChangeText={handleLastNameChange} />
          </Item>
          <Item>
            <Input placeholder="Email" value={email} onChangeText={handleEmailChange} autoCompleteType="email" keyboardType="email-address" textContentType="emailAddress" autoCapitalize="none" />
          </Item>
          <Item last>
            <Input placeholder="Password" value={password} onChangeText={handlePasswordChange} secureTextEntry={true} textContentType="password" autoCompleteType="password" autoCapitalize="none" />
          </Item>
          <Item last>
            <Input placeholder="One Time Password" value={otpToken} onChangeText={handleOtpTokenChange} keyboardType="number-pad" />
          </Item>
          <Button success onPress={linkToOtp}>
            <Text>One Time Password Generate</Text>
          </Button>
          <Button block primary onPress={submit}>
            <Text>Submit</Text>
          </Button>
        </Form>
      </Content>
    )
  }
}

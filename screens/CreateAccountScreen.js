import React, {useContext, useState, useEffect} from 'react';
import {Linking, Keyboard} from 'react-native';
import {Button, Content, Form, Item, Input, Text} from 'native-base';

import Api from '../components/Api';
import Utils from '../components/Utils';
import DiskStore from '../components/DiskStore';
import {Context} from '../components/MemoryStore';

export default function CreateAccountScreen({navigation}) {
  const {dispatch} = useContext(Context);

  const [state, setState] = useState('CREATE_USER');
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState('');
  const handleEmailChange = (value) => setEmail(value);

  const [password, setPassword] = useState('');
  const handlePasswordChange = (value) => setPassword(value);

  const [firstName, setFirstName] = useState('');
  const handleFirstNameChange = (value) => setFirstName(value);

  const [lastName, setLastName] = useState('');
  const handleLastNameChange = (value) => setLastName(value);

  const [emailVerification, setEmailVerification] = useState('');
  const handleEmailVerificationChange = (value) => setEmailVerification(value);

  //  const [otpToken, setOtpToken] = useState("");
  //  const handleOtpTokenChange = (value) => { setOtpToken(value) }

  // const [otp, setOtp] = useState(null);

  useEffect(() => {
    const call = async () => {
      // const otpApi = await Api.createOneTimePassword();
      //       if (otpApi.data.id) {
      //         setLoading(false);
      //         setOtp(otpApi);
      //       }
    };

    call();
  }, []);

  //  const linkToOtp = async () => {
  //    await Linking.openURL(`otpauth://totp/Iron_Payments%3A${encodeURIComponent(email)}?secret=${otp.data.attributes.secret}&issuer=Iron`);
  //  }

  const submit = async () => {
    if (state === 'CREATE_USER') {
      const user = await Api.createUser(email, password, firstName, lastName);
      if (user) {
        setUser(user);
        setState('EMAIL_VERIFICATION');
      }
    } else if (state === 'EMAIL_VERIFICATION') {
      const verification = await Api.createEmailVerification(
        user,
        email,
        emailVerification,
      );

      if (verification) {
        const token = await Utils.createSessionAndToken(email, password);
        dispatch({type: 'LOG_IN', token: token});
      }
    }
  };

  const emailVerificationView = () => (
    <Content padder>
      <Text>
        We sent a email to verify it, please type in the code that was sent
      </Text>
      <Form>
        <Item>
          <Input
            placeholder="Verification code"
            value={emailVerification}
            onChangeText={handleEmailVerificationChange}
          />
        </Item>
        <Button block primary onPress={submit}>
          <Text>Submit</Text>
        </Button>
      </Form>
    </Content>
  );

  const userCreation = () => (
    <Content padder>
      <Form>
        <Item>
          <Input
            placeholder="First Name"
            value={firstName}
            onChangeText={handleFirstNameChange}
          />
        </Item>
        <Item>
          <Input
            placeholder="Last Name"
            value={lastName}
            onChangeText={handleLastNameChange}
          />
        </Item>
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
        <Button block primary onPress={submit}>
          <Text>Submit</Text>
        </Button>
      </Form>
    </Content>
  );

  if (state == 'CREATE_USER') {
    return userCreation();
  } else if (state == 'EMAIL_VERIFICATION') {
    return emailVerificationView();
  }
}

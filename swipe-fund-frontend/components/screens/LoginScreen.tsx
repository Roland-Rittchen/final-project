import { gql, useMutation } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from 'react';
import {
  Button,
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { userContext } from '../../util/Context';
import { Props } from '../../util/navigationTypes';

interface Users {
  user: {
    id: number;
    username: String;
    userlevel: number;
    accountVal: number;
    sessionId: number;
  };
  error: String;
}

const logUserIn = gql`
  mutation LogUserIn($name: String!, $password: String!) {
    logUserIn(name: $name, password: $password) {
      user {
        id
        username
        userlevel
        accountVal
        sessionId
      }
      error
    }
  }
`;

export default function Login({ navigation }: Props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { setUser } = useContext(userContext);
  const [loginUser] = useMutation<
    { loginUser: Users },
    { name: string; password: string }
  >(logUserIn);

  async function submitLogin(e: NativeSyntheticEvent<NativeTouchEvent>) {
    e.preventDefault();
    try {
      const tmpUser = await loginUser({
        variables: { name: name, password: password },
      });
      // console.log(JSON.stringify(tmpUser));
      if (tmpUser.data.logUserIn.user) {
        const tU = tmpUser.data.logUserIn.user;
        // console.log('TU: ' + JSON.stringify(tU));
        setUser({
          id: tU.id,
          username: tU.username,
          userlevel: tU.userlevel,
          accountVal: tU.accountVal,
          sessionId: tU.sessionId,
        });

        // console.log('USER: ' + JSON.stringify(user));
      }

      setErrorMsg(tmpUser.data.logUserIn.error);
      // console.log('reset und route');
      if (errorMsg === '') {
        console.log(errorMsg);
        setName('');
        setPassword('');
        navigation.navigate('Home');
      }
    } catch (err) {
      console.log('Error logging in: ' + err);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.container}>
        <Text>Login:</Text>
        <TextInput
          style={styles.input}
          autoCompleteType="username"
          textContentType="username"
          placeholder="Username"
          value={name}
          onChangeText={(e) => setName(e)}
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          autoCompleteType="password"
          placeholder="Password"
          value={password}
          onChangeText={(e) => setPassword(e)}
        />
        <Text style={styles.error}>{errorMsg}</Text>
        <Button title="Login" onPress={(e) => submitLogin(e)} />
        <Text>Not registered yet? Register here: </Text>
        <Button
          title="Register"
          onPress={() => navigation.navigate('Signup')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderColor: 'gray',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
});

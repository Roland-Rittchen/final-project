import { gql, useMutation } from '@apollo/client';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from 'react';
import {
  NativeSyntheticEvent,
  NativeTouchEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { RootStackParams } from '../../App';
import { userContext } from '../../util/Context';

// interface Users {
//   user: {
//     id: number;
//     username: String;
//     userlevel: number;
//     accountVal: number;
//     sessionId: number;
//   };
//   error: String;
// }

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

type LoginscreenProps = NativeStackScreenProps<RootStackParams, 'Login'>;

export default function Login({ navigation }: LoginscreenProps) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { setUser } = useContext(userContext);
  const [loginUser] = useMutation<
    any, //  { data: { logUserIn: { user: Users } } }
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
      const tmpError = tmpUser.data.logUserIn.error;
      setErrorMsg(tmpUser.data.logUserIn.error);
      // console.log('reset und route');
      if (tmpError === '') {
        console.log(tmpError);
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
        <Pressable onPress={(e) => submitLogin(e)}>
          <View style={styles.userContainerButton}>
            <Text style={styles.userTextButton}>Login</Text>
          </View>
        </Pressable>
        <Text style={styles.plaintext}>
          Not registered yet? Register here:{' '}
        </Text>
        <Pressable onPress={() => navigation.navigate('Signup')}>
          <View style={styles.userContainerButtonLow}>
            <Text style={styles.userTextButtonLow}>Signup</Text>
          </View>
        </Pressable>
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
    width: 350,
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    margin: 15,
  },
  error: {
    margin: 10,
    color: 'red',
    fontWeight: 'bold',
  },
  userContainerButton: {
    backgroundColor: '#6DA10B',
    width: 350,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    padding: 20,
    margin: 15,
    borderRadius: 15,
  },
  userTextButton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userContainerButtonLow: {
    backgroundColor: 'lightgrey',
    width: 350,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    padding: 20,
    margin: 15,
    borderRadius: 15,
  },
  userTextButtonLow: {
    color: 'darkslategrey',
    fontWeight: 'bold',
  },
  plaintext: {
    marginTop: 15,
  },
});

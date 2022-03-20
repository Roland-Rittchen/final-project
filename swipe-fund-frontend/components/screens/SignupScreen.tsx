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
  id: number;
  username: String;
  userlevel: number;
  sessionId: number;
}

const createUser = gql`
  mutation CreateUser(
    $name: String!
    $level: Int!
    $accountVal: Real!
    $password: String!
  ) {
    createUser(
      name: $name
      level: $level
      accountVal: $accountVal
      password: $password
    ) {
      user {
        id
        username
        userlevel
        sessionId
      }
    }
  }
`;

export default function Signup({ navigation }: Props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useContext(userContext);
  const { setUser } = useContext(userContext);
  const [createNewUser, { data, error, reset }] = useMutation<
    { createUser: Users },
    { name: string; level: number; accountVal: number; password: string }
  >(createUser); // , {
  //   onCompleted: () => {},
  // });

  async function submitRegistration(e: NativeSyntheticEvent<NativeTouchEvent>) {
    e.preventDefault();
    try {
      const tmpUser = await createNewUser({
        variables: {
          name: name,
          level: 1,
          accountVal: 100,
          password: password,
        },
      });
      // console.log(JSON.stringify(tmpUser.data.createUser.user));
      if (tmpUser.data.createUser.user) {
        const tU = tmpUser.data.createUser.user;
        // console.log('TU: ' + JSON.stringify(tU));
        setUser({
          id: parseInt(tU.id),
          username: tU.username,
          userlevel: parseInt(tU.userlevel),
          sessionId: parseInt(tU.sessionId),
        });
        // console.log('USER: ' + JSON.stringify(user));
      }
      // console.log('reset und route');
      setName('');
      setPassword('');
      navigation.navigate('Home');
    } catch (err) {
      // console.log('Error creating the user: ' + err);
    }
  }

  if (error) {
    return (
      <View style={styles.container}>
        {/* <Text>`full error: ${JSON.stringify(error, null, 2)}`</Text> */}
        <Text>
          `Submission error! ${error.message} the data is $
          {JSON.stringify(data)}`
        </Text>
        <Button title="Dismiss" onPress={() => reset()} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.container}>
        <Text>Register:</Text>
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
        <Button title="Submit" onPress={(e) => submitRegistration(e)} />
        <Text>{JSON.stringify(data)}</Text>
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
  err: {
    color: 'red',
    fontWeight: 'bold',
  },
});

/*
{
  "createUser":{
    "user":{
      "id":"34",
      "__typename":"User"
    },
  "__typename":"AuthPayload"
  }
}
*/

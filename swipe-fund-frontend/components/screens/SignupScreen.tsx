import { gql, useMutation, useQuery } from '@apollo/client';
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

const createUser = gql`
  mutation CreateUser(
    $name: String!
    $level: Int!
    $accountVal: Int!
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
        accountVal
        sessionId
      }
      error
    }
  }
`;

const userExist = gql`
  query GetUserExists($name: String) {
    getUserExists(name: $name) {
      error
    }
  }
`;

export default function Signup({ navigation }: Props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(true);
  const { setUser } = useContext(userContext);
  const [createNewUser, { error, reset }] = useMutation<
    { createUser: Users },
    { name: string; level: number; accountVal: number; password: string }
  >(createUser);
  const {
    loading,
    error: queryError,
    data: checkExist,
    refetch,
  } = useQuery(userExist, {
    variables: { name },
  });

  async function submitRegistration(e: NativeSyntheticEvent<NativeTouchEvent>) {
    e.preventDefault();
    setErrorMsg('');
    if (password === '') {
      setErrorMsg('No Password provided');
      setSuccess(false);
    }
    if (name === '') {
      setErrorMsg('No Username provided');
      setSuccess(false);
    }
    try {
      await refetch();
      if (checkExist.getUserExists.error !== '') {
        setErrorMsg(checkExist.getUserExists.error);
        setSuccess(false);
      }
    } catch (err) {
      console.log('Error checking the user: ' + err);
    }
    if (success) {
      try {
        createNewUser({
          variables: {
            name: name,
            level: 1,
            accountVal: 100,
            password: password,
          },
        })
          .then((tmpUser) => {
            // console.log(tmpUser);
            if (tmpUser.data.createUser.user !== null) {
              setUser({
                id: tmpUser.data.createUser.user.id,
                username: tmpUser.data.createUser.user.username,
                userlevel: tmpUser.data.createUser.user.userlevel,
                sessionId: tmpUser.data.createUser.user.sessionId,
              });
              setErrorMsg(tmpUser.data.createUser.error);
            }
          })
          .catch((er) => console.log('Error creating the user: ' + er));
        // const tmpUser = await createNewUser({
        //   variables: {
        //     name: name,
        //     level: 1,
        //     accountVal: 100,
        //     password: password,
        //   },
        // });

        // console.log(JSON.stringify(tmpUser));
        // if (tmpUser.data.createUser.user) {
        //   const tU = tmpUser.data.createUser.user;

        //   setUser({
        //     id: parseInt(tU.id),
        //     username: tU.username,
        //     userlevel: parseInt(tU.userlevel),
        //     sessionId: parseInt(tU.sessionId),
        //   });
        // }
        // setErrorMsg(tmpUser.data.createUser.error);

        if (errorMsg === '') {
          // console.log('error msg empty');
          setName('');
          setPassword('');
          navigation.navigate('Home');
        }
      } catch (err) {
        console.log('Error creating the user: ' + err);
        reset();
      }
    }
    setSuccess(true);
  }

  // if (error) {
  //   return (
  //     <View style={styles.container}>
  //       {/* <Text>`full error: ${JSON.stringify(error, null, 2)}`</Text> */}
  //       <Text>
  //         `Submission error! ${error.message} the data is $
  //         {JSON.stringify(data)}`
  //       </Text>
  //       <Button title="Dismiss" onPress={() => reset()} />
  //     </View>
  //   );
  // }
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
        <Text style={styles.error}>{errorMsg}</Text>
        <Button title="Submit" onPress={(e) => submitRegistration(e)} />
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

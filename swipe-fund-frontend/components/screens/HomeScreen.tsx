import { gql, useQuery } from '@apollo/client';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import React, { Component, useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { userContext } from '../../util/Context';
import { Props } from '../../util/navigationTypes';

const userQuery = gql`
  query {
    getAllUsers {
      id
      username
    }
  }
`;

const getUserBySession = gql`
  query GetUserBySessionToken {
    getUserBySessionToken {
      id
      username
      userlevel
      accountVal
    }
  }
`;

export default function Homescreen({ navigation }: Props) {
  const { data, error, loading } = useQuery(userQuery);
  const { user } = useContext(userContext);
  const { setUser } = useContext(userContext);
  const { data: userBySessData } = useQuery(getUserBySession);

  useEffect(() => {
    console.log(JSON.stringify(userBySessData.getUserBySessionToken));
    if (userBySessData.getUserBySessionToken) {
      const tU = userBySessData.getUserBySessionToken;
      setUser({
        id: parseInt(tU.id),
        username: tU.username,
        userlevel: tU.userlevel,
        accountVal: tU.accountVal,
        sessionId: tU.sessionId,
      });
    }
  }, [userBySessData, setUser]);

  return (
    <View style={styles.container}>
      <StatusBar />
      {user ? <Text>`logged in `</Text> : <Text>NOT logged in</Text>}
      <Text>Data:</Text>
      <Text>{JSON.stringify(data)}</Text>
      <Text>User:</Text>
      {/* <Text>{JSON.stringify(user)}</Text>*/}
      <Button title="Register" onPress={() => navigation.navigate('Signup')} />
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
});

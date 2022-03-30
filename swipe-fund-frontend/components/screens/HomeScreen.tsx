import { gql, useQuery } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { userContext } from '../../util/Context';
import { RootStackParams } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const userQuery = gql`
  query GetAllUsers {
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

type HomescreenProps = NativeStackScreenProps<RootStackParams, 'Home'>;

export default function Homescreen({ navigation }: HomescreenProps) {
  const { data } = useQuery(userQuery);
  const { user } = useContext(userContext);
  const { setUser } = useContext(userContext);
  const { data: userBySessData } = useQuery(getUserBySession, {
    pollInterval: 1000,
  });

  useEffect(() => {
    if (userBySessData) {
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
    }
  }, [setUser, userBySessData]);

  return (
    <View style={styles.container}>
      <StatusBar />
      {user ? <Text>`logged in `</Text> : <Text>NOT logged in</Text>}
      <Text>Data:</Text>
      <Text>{JSON.stringify(data)}</Text>
      <Text>User: 📈 📉 </Text>
      {/* <Text>{JSON.stringify(user)}</Text>*/}
      {user ? (
        <Text>{'\n'}</Text>
      ) : (
        <Button
          title="Register"
          onPress={() => navigation.navigate('Signup')}
        />
      )}
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

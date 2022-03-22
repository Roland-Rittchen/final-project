import { gql, useMutation } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { userContext } from '../../util/Context';
import { Props } from '../../util/navigationTypes';

const deleteSession = gql`
  mutation DeleteSessionByToken {
    deleteSessionByToken {
      success
    }
  }
`;

export default function Logout({ navigation }: Props) {
  const { setUser } = useContext(userContext);
  const [logoutUser] = useMutation(deleteSession);
  return (
    <View style={styles.container}>
      <StatusBar />

      <View style={styles.container}>
        <Button
          title="Logout"
          onPress={async (e) => {
            e.preventDefault();
            await logoutUser();
            setUser(undefined);
            navigation.navigate('Home');
          }}
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
});

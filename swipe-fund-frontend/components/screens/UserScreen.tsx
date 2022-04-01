import { gql, useMutation } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { userContext } from '../../util/Context';
import { getStars } from './RankingScreen';
import { RootStackParams } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const deleteSession = gql`
  mutation DeleteSessionByToken {
    deleteSessionByToken {
      success
    }
  }
`;

type UserscreenProps = NativeStackScreenProps<RootStackParams, 'Profile'>;

export default function User({ navigation }: UserscreenProps) {
  const { user } = useContext(userContext);
  const { setUser } = useContext(userContext);
  const [logoutUser] = useMutation(deleteSession);

  return (
    <View style={styles.container}>
      <StatusBar />
      {user ? (
        <View style={styles.container}>
          <View style={styles.userContainer}>
            <Text style={styles.userText}>Username: {user.username}</Text>
          </View>
          <View style={styles.userContainer}>
            <Text style={styles.userText}>
              Userlevel: {getStars(user.userlevel)}
            </Text>
          </View>
          <View style={styles.userContainer}>
            <Text style={styles.userText}>
              Account Value: {user.accountVal.toFixed(2)}
            </Text>
          </View>
          <Pressable
            onPress={async (e) => {
              e.preventDefault();
              await logoutUser();
              setUser(undefined);
              navigation.navigate('Home');
            }}
          >
            <View style={styles.userContainerButton}>
              <Text style={styles.userTextButton}>Logout</Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <View style={styles.container}>
          <Text>Error - User not logged in.</Text>
          <Text>Please sign in.</Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <View style={styles.userContainerButton}>
              <Text style={styles.userTextButton}>Logout</Text>
            </View>
          </Pressable>
        </View>
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
  input: {
    borderColor: 'gray',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  userContainer: {
    width: 350,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    padding: 20,
    margin: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'grey',
  },
  userText: {
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
});

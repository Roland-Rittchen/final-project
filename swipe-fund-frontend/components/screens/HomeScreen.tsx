import { gql, useQuery } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { userContext } from '../../util/Context';
import { RootStackParams } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

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
      {user ? (
        <View style={styles.subcontainer}>
          <Text style={styles.h1}>Welcome to Swipefund</Text>
          <Text>
            Your daytrading app is ready for you. Head over to your user
            profile, or practice your skills in the Demo mode. The demo mode
            will show you how Swipefund works, by simulating your daily news
            briefing and giving you the chance to make your play, over the
            course of 5 days in one go.
          </Text>
        </View>
      ) : (
        <View style={styles.subcontainer}>
          <Text style={styles.h1}>Welcome to Swipefund</Text>
          <Text>
            Swipefund is a daytrading app for beginners who want to be active in
            the market. Everyday you receive relevant news by opinion leaders to
            inform you about the market trends of the day. In addition you see
            the performance of leading stock indices over the past 5 days. Then
            it is your turn! With a simple slider, you make your bet. Will the
            market go up, down or sideways. Get a feeling for the market and
            with increasing success, unlock higher levels, where you can
            leverage your position up to 20 times!
          </Text>
        </View>
      )}

      {user ? (
        <>
          <Pressable
            onPress={() => {
              navigation.navigate('Profile');
            }}
          >
            <View style={styles.userContainerButtonLow}>
              <Text style={styles.userTextButtonLow}>User Profile</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('Demo');
            }}
          >
            <View style={styles.userContainerButtonLow}>
              <Text style={styles.userTextButtonLow}>Demo</Text>
            </View>
          </Pressable>
        </>
      ) : (
        <Pressable
          onPress={() => {
            navigation.navigate('Signup');
          }}
        >
          <View style={styles.userContainerButton}>
            <Text style={styles.userTextButton}>Signup</Text>
          </View>
        </Pressable>
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
  subcontainer: {
    margin: 25,
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
  h1: {
    color: '#6DA10B',
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 25,
  },
});

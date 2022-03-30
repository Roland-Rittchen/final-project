import { gql, useQuery } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const userQuery = gql`
  query GetAllUsers {
    getAllUsers {
      id
      username
      userlevel
      accountVal
    }
  }
`;

type User = {
  id: number;
  username: string;
  userlevel: number;
  accountVal: number;
};

export default function Ranking() {
  const { data } = useQuery(userQuery);
  const [userList, setUserList] = useState<User[] | undefined>();
  useEffect(() => {
    if (data) {
      const users = data.getAllUsers.sort(function (a: User, b: User) {
        if (a.accountVal < b.accountVal) {
          return -1;
        }
        if (a.accountVal > b.accountVal) {
          return 1;
        }

        // names must be equal
        return 0;
      });
      if (users.length > 5) {
        users.slice(0, 5);
      }

      setUserList(users);
    }
  }, [data]);

  function getStars(num: number) {
    if (num === 1) {
      return '⭐';
    } else if (num === 2) {
      return '⭐⭐';
    } else if (num === 3) {
      return '⭐⭐⭐';
    } else {
      return '';
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.container}>
        <Text>Ranking:</Text>
        {userList
          ? userList.map((userItem, index) => {
              return (
                <View key={userItem.id} style={styles.rankContainer}>
                  <Text>{index + 1}</Text>
                  <Text>{userItem.username}</Text>
                  <Text>{getStars(userItem.userlevel)}</Text>
                  <Text>{userItem.accountVal}</Text>
                </View>
              );
            })
          : null}
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
  rankContainer: {
    flexDirection: 'row',
  },
});

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
  __typename: string;
  id: number;
  username: string;
  userlevel: number;
  accountVal: number;
};

export function getStars(num: number) {
  if (num === 1) {
    return '⭐';
  } else if (num === 2) {
    return '⭐ ⭐';
  } else if (num === 3) {
    return '⭐ ⭐ ⭐';
  } else {
    return '';
  }
}

export default function Ranking() {
  const { data } = useQuery(userQuery);
  const [userList, setUserList] = useState<User[] | undefined>();
  useEffect(() => {
    if (data) {
      const users = [...data.getAllUsers];
      function compareValues(a: User, b: User) {
        if (a.accountVal > b.accountVal) {
          return -1;
        } else if (a.accountVal < b.accountVal) {
          return 1;
        } else {
          // account Value must be equal
          return 0;
        }
      }
      users.sort(compareValues);
      // console.log(JSON.stringify(users));
      setUserList(users.slice(0, 5));
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.headContainer}>
          <Text style={styles.rankContainerText}>Rank</Text>
          <Text style={styles.rankContainerText}>User</Text>
          <Text style={styles.rankContainerText}>Level</Text>
          <Text style={styles.rankContainerText}>Value</Text>
        </View>
        {userList
          ? userList.map((userItem, index) => {
              return (
                <View key={userItem.id} style={styles.rankContainer}>
                  <Text style={styles.rankContainerText}>{index + 1}</Text>
                  <Text style={styles.rankContainerText}>
                    {userItem.username}
                  </Text>
                  <Text style={styles.rankContainerText}>
                    {getStars(userItem.userlevel)}
                  </Text>
                  <Text style={styles.rankContainerText}>
                    {userItem.accountVal}
                  </Text>
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
  headContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    marginLeft: 15,
    marginRight: 15,
  },
  rankContainer: {
    flexDirection: 'row',
    padding: 20,
    margin: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'grey',
  },
  rankContainerText: {
    flex: 1,

    fontWeight: 'bold',
  },
});

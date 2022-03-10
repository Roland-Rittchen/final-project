import { gql, useMutation } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Props } from '../../util/navigationTypes';
import { Header } from '../Header';

const createUser = gql`
  mutation CreateUser($name: String!, $password: String!, $level: Int!) {
    createUser(name: $name, password: $password, level: $level) {
      user {
        id
      }
      token
    }
  }
`;

export default function Signup({ navigation }: Props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [createTheUser, { data, loading, error }] = useMutation(createUser);
  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;

  return (
    <View style={styles.container}>
      <StatusBar />
      <Header navigation={navigation} />
      <View style={styles.container}>
        <Text>Register:</Text>
        <TextInput
          style={styles.input}
          autoCompleteType="username"
          textContentType="username"
          placeholder="Username"
          onChangeText={(e) => setName(e)}
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          autoCompleteType="password"
          placeholder="Password"
          onChangeText={(e) => setPassword(e)}
        />
        <Button
          title="Submit"
          onPress={(e) => {
            e.preventDefault();
            createTheUser({
              variables: { name: name, password: password, level: 1 },
            }).catch((err) => console.log(err));
            setName('');
            setPassword('');
            navigation.navigate('Login');
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

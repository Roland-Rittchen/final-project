import { gql, useQuery } from '@apollo/client';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Props } from '../../util/navigationTypes';
import { Header } from '../Header';

const userQuery = gql`
  query {
    getAllUsers {
      id
      username
    }
  }
`;

export default function Homescreen({ navigation }: Props) {
  const { data, loading } = useQuery(userQuery);

  if (loading) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      <Header navigation={navigation} />
      <Text>Data:</Text>
      <Text>{JSON.stringify(data)}</Text>
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

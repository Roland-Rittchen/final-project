import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Props } from '../../util/navigationTypes';
import { Header } from '../Header';

export default function Demo({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar />
      <Header navigation={navigation} />
      <View style={styles.container}>
        <Text>Register:</Text>
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Demo() {
  const [cook, setCook] = useState('');
  const [gcook, setGcook] = useState('');

  async function getter() {
    try {
      const resp = await AsyncStorage.getItem('@MyApp_token');
      if (resp != null) {
        setGcook(resp);
      }
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getter().catch((err) => console.log(err));
  }, [cook]);

  async function setter(value: string) {
    try {
      await AsyncStorage.setItem('@MyApp_token', value);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar />

      <View style={styles.container}>
        <Text>Demo to fiddle around goes right here</Text>
        <Text>Async Storage content: {gcook}</Text>
        <TextInput
          style={styles.input}
          placeholder="Cookietext"
          onChangeText={(e) => setCook(e)}
        />
        <Button
          title="Submit"
          onPress={async (e) => {
            e.preventDefault();
            await setter(cook);
            await getter();
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

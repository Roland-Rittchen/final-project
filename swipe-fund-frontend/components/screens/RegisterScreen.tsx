import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Header } from '../Header';

export default function Register() {
  const { register, handleSubmit, setValue } = useForm();
  const onSubmit = useCallback((formData) => {
    console.log(formData);
  }, []);
  const onChangeField = useCallback(
    (name) => (text: String) => {
      setValue(name, text);
    },
    [setValue],
  );

  useEffect(() => {
    register('email');
    register('password');
  }, [register]);

  return (
    <View style={styles.container}>
      <StatusBar />
      <Header />
      <View style={styles.container}>
        <Text>Register:</Text>
        <TextInput
          style={styles.input}
          autoCompleteType="username"
          textContentType="username"
          placeholder="Username"
          onChangeText={onChangeField('email')}
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          autoCompleteType="password"
          placeholder="Password"
          onChangeText={onChangeField('password')}
        />
        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
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

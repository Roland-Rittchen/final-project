import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Contact() {
  return (
    <View style={styles.container}>
      <StatusBar />
      <WebView
        source={{
          html: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.2826374871665!2d16.40654041881787!3d48.19327951283774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d075b18eb3795%3A0xe5bf995e186b16c!2sMarkhof%20-%20Seminarzentrum%2C%20Kulturzentrum%2C%20Coworkingspace!5e0!3m2!1sen!2sat!4v1648662906799!5m2!1sen!2sat" width="1000" height="1000" style="border:0;" allowfullscreen="true" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
        }}
        style={{
          flex: 1,
          width: 400,
          height: 300,
          marginTop: 20,
        }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>Contact us at:</Text>
        <Text style={styles.text}>Randomaddress 123</Text>
        <Text style={styles.text}>A-1030 Vienna</Text>
        <Text style={styles.text}>Austria</Text>

        <TouchableOpacity
          onPress={async () => {
            await Linking.openURL('https://github.com/Roland-Rittchen');
          }}
        >
          <Text style={styles.textLink}>
            https://github.com/Roland-Rittchen
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    margin: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    alignItems: 'center',
    justifyContent: 'center',

    fontSize: 20,
  },
  textLink: {
    color: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    textDecorationLine: 'underline',
    fontSize: 20,
  },
});

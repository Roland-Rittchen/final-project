import { css } from '@emotion/native';
import { Roboto_400Regular, useFonts } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import Constants from 'expo-constants';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/constants';

// import { label, safeArea, view } from '../styles/headerStyle';

const font = css`
  font-family: 'Roboto_400Regular';
`;

export const Header: React.FC = () => {
  const [loaded, error] = useFonts({
    Roboto_400Regular,
  });

  if (error) {
    return (
      <View style={styles.container}>{JSON.stringify(error, null, 2)}</View>
    );
  }
  if (loaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.label}>LabelText</Text>
        </View>
      </SafeAreaView>
    );
  } else {
    return <AppLoading />;
  }
};

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
    backgroundColor: colors.cardBackground,
  },
  container: {
    paddingTop: Constants.statusBarHeight + 10,
    paddingBottom: 20,
  },
  label: {
    color: colors.text,
    fontFamily: 'Roboto_400Regular',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

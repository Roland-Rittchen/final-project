import { css } from '@emotion/native';
import { Roboto_400Regular, useFonts } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import Constants from 'expo-constants';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../styles/constants';
import { Props } from '../util/navigationTypes';

// import { label, safeArea, view } from '../styles/headerStyle';

const font = css`
  font-family: 'Roboto_400Regular';
`;
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
  menubutton: {
    height: 50,
    width: 50,
  },
});
const menu = '../assets/menu-icon.svg';
export const Header = ({ navigation }) => {
  const [loaded, error] = useFonts({
    Roboto_400Regular,
  });

  function onHamburgerClick() {
    navigation.toggleDrawer();
  }

  if (error) {
    return (
      <View style={styles.container}>{JSON.stringify(error, null, 2)}</View>
    );
  }
  if (loaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View>
            <TouchableOpacity onPress={onHamburgerClick}>
              <img alt="Menu Button" style={styles.menubutton} src={menu} />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>LabelText</Text>
          <Text style={styles.label}>100 €</Text>
        </View>
      </SafeAreaView>
    );
  } else {
    return <AppLoading />;
  }
};

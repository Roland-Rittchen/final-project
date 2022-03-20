import 'react-native-gesture-handler';
import { css } from '@emotion/native';
// import { Roboto_400Regular, useFonts } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import Constants from 'expo-constants';
import React, { Component, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'react-native-elements';
import { colors } from '../styles/constants';
import { Props } from '../util/navigationTypes';

// import { label, safeArea, view } from '../styles/headerStyle';

// const font = css`
//   font-family: 'Roboto_400Regular';
// `;
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
  // const [loaded, error] = useFonts({
  //   Roboto_400Regular,
  // });

  function onHamburgerClick() {
    navigation.toggleDrawer();
  }

  // if (error) {
  //   return (
  //     <View style={styles.container}>{JSON.stringify(error, null, 2)}</View>
  //   );
  // }
  // if (loaded) {
  //   return (
  //     <SafeAreaView style={styles.safeArea}>
  //       <View style={styles.container}>
  //         <View>
  //           <TouchableOpacity onPress={onHamburgerClick}>
  //             {/*<Image
  //               alt="Menu Button"
  //               style={styles.menubutton}
  //               source={menu}
  //   />*/}
  //           </TouchableOpacity>
  //         </View>
  //         <Text style={styles.label}>LabelText</Text>
  //         <Text style={styles.label}>100 €</Text>
  //       </View>
  //     </SafeAreaView>
  //   );
  // } else {
  //   return <AppLoading />;
  // }
};

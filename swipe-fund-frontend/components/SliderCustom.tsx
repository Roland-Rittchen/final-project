import React, { Dispatch } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';

export default function Slidercustom(props: {
  value: number;
  setValue: Dispatch<number>;
}) {
  return (
    <View>
      <Text style={styles.text}>{props.value && +props.value.toFixed(0)}</Text>
      <Slider
        vertical={true}
        minimumValue={-1}
        maximumValue={1}
        step={1}
        thumbImage={require('../assets/button.png')}
        trackImage={require('../assets/threepoint-slider.png')}
        style={styles.slider}
        {...props}
        onValueChange={(val) => props.setValue(val)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  slider: {
    width: 300,
    opacity: 1,
    height: 50,
    marginTop: 10,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    margin: 0,
  },
});

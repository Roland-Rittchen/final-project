import React, { Dispatch, useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import RnVerticalSlider from 'rn-vertical-slider';

export function Level1slider(props: {
  value: number;
  setValue: Dispatch<number>;
}) {
  const [dirText, setDirText] = useState('sideways');

  useEffect(() => {
    if (props.value > 0) {
      setDirText('up');
    } else if (props.value < 0) {
      setDirText('down');
    } else {
      setDirText('level');
    }
  }, [props.value]);

  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.slidertext}>{dirText}</Text>
      <RnVerticalSlider
        value={props.value}
        min={-1}
        max={1}
        onChange={(val: number) => {
          props.setValue(val);
        }}
        onComplete={(val: number) => {
          props.setValue(val);
        }}
        width={50}
        height={300}
        step={1}
        borderRadius={25}
        minimumTrackTintColor="#6DA10B"
        maximumTrackTintColor="#ED5334"
        showBallIndicator
        ballIndicatorColor="#9CED05"
        ballIndicatorWidth={70}
        ballIndicatorHeight={70}
        ballIndicatorPosition={-10}
        ballIndicatorTextColor="#9CED05"
      />
    </View>
  );
}

export function Level2slider(props: {
  setValue: Dispatch<number>;
  direction: number;
  setDirection: Dispatch<number>;
  multiplier: number;
  setMultiplier: Dispatch<number>;
}) {
  useEffect(() => {
    const newVal = props.direction * props.multiplier;
    props.setValue(newVal);
  }, [props]);
  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <Level1slider value={props.direction} setValue={props.setDirection} />
      </View>
      <View style={styles.subcontainer}>
        <View style={styles.sliderContainer}>
          <Text style={styles.slidertext}>{props.multiplier}X</Text>
          <RnVerticalSlider
            value={props.multiplier}
            disabled={false}
            min={1}
            max={20}
            onChange={(val: number) => {
              props.setMultiplier(val);
            }}
            onComplete={(val: number) => {
              props.setMultiplier(val);
            }}
            width={50}
            height={300}
            step={1}
            borderRadius={25}
            minimumTrackTintColor="#6DA10B"
            maximumTrackTintColor="grey"
            showBallIndicator
            ballIndicatorColor="#9CED05"
            ballIndicatorWidth={70}
            ballIndicatorHeight={70}
            ballIndicatorPosition={-10}
            ballIndicatorTextColor="#9CED05"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subcontainer: {
    flex: 1,
    marginTop: 50,
    marginBottom: 50,
  },
  slidertext: {
    fontWeight: 'bold',
    marginBottom: 15,
  },
  h2: {
    color: '#6DA10B',
    fontWeight: 'bold',
    fontSize: 25,
    marginLeft: 40,
    marginTop: 25,
  },
});

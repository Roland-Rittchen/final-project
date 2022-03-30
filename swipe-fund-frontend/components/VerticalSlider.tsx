import React, { Dispatch, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import RnVerticalSlider from 'rn-vertical-slider';

export function Level1slider(props: {
  value: number;
  setValue: Dispatch<number>;
}) {
  return (
    <View style={styles.container}>
      <RnVerticalSlider
        value={props.value}
        disabled={false}
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
  value: number;
  setValue: Dispatch<number>;
}) {
  const [direction, setDirection] = useState<number>(props.value);
  const [multiplier, setMultiplier] = useState<number>(1);

  useEffect(() => {
    const newVal = direction * multiplier;
    props.setValue(newVal);
  }, [props, direction, multiplier]);
  return (
    <View>
      <Level1slider value={direction} setValue={setDirection} />
      <View style={styles.container}>
        <RnVerticalSlider
          value={multiplier}
          disabled={false}
          min={1}
          max={20}
          onChange={(val: number) => {
            setMultiplier(val);
          }}
          onComplete={(val: number) => {
            setMultiplier(val);
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

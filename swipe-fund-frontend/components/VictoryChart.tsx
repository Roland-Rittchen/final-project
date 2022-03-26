import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
} from 'victory-native';
import { VictoryData } from '../data/stockPrices';

type Props = {
  title: string;
  data: VictoryData;
  color: string;
};

export default function App(props: Props) {
  return (
    <View style={styles.container}>
      <VictoryChart height={200} width={200}>
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={100}
          y={35}
          style={{ fontSize: 15, fontWeight: 'bold' }}
          text={props.title}
        />
        <VictoryAxis
          style={{
            axis: { stroke: 'transparent' },
            ticks: { stroke: 'transparent' },
            tickLabels: { fill: 'transparent' },
          }}
        />
        <VictoryArea
          style={{ data: { fill: props.color + '30' } }}
          data={props.data}
        />
        <VictoryLine
          data={props.data}
          domain={{
            x: [0, 100],
            y: [0, 100],
          }}
          interpolation="monotoneX"
          style={{
            data: { stroke: props.color, strokeWidth: 4.5 },
          }}
        />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff88',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});

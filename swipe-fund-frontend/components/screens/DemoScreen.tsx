import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import { userContext } from '../../util/Context';
import { Level1slider, Level2slider } from '../VerticalSlider';
import Victory from '../VictoryChart';
import {
  VictoryData,
  getVictoryChartData,
  getColor,
  getIndexOnDate,
} from '../../data/stockPrices';
import { FTNews } from '../FTNews';
import { ScrollView } from 'react-native-gesture-handler';
import {
  levelUp,
  onDisplayNotificationDown,
  onDisplayNotificationUp,
} from '../../util/notifications';

export default function Demo() {
  const { user } = useContext(userContext);
  const { setUser } = useContext(userContext);
  const [value, setValue] = useState<number>(0);
  const [counter, setCounter] = useState<number>(0);

  const dates = [
    '2022-03-21',
    '2022-03-22',
    '2022-03-23',
    '2022-03-24',
    '2022-03-25',
  ];
  const [date, setDate] = useState<string>(dates[0]);

  const [sp500, setSp500] = useState<VictoryData>(
    getVictoryChartData('sp500', date),
  );
  const [sp500Color, setSp500Color] = useState<string>(getColor('sp500', date));
  const [dax, setDax] = useState<VictoryData>(getVictoryChartData('dax', date));
  const [daxColor, setDaxColor] = useState<string>(getColor('dax', date));
  const [nasdaq, setNasdaq] = useState<VictoryData>(
    getVictoryChartData('nasdaq', date),
  );
  const [nikkeiColor, setNikkeiColor] = useState<string>(
    getColor('nasdaq', date),
  );

  useEffect(() => {
    setSp500(getVictoryChartData('sp500', date));
    setSp500Color(getColor('sp500', date));
    setDax(getVictoryChartData('dax', date));
    setDaxColor(getColor('dax', date));
    setNasdaq(getVictoryChartData('nasdaq', date));
    setNikkeiColor(getColor('nasdaq', date));
  }, [date]);

  async function updateAccountValue(count: number) {
    const newPrice = getIndexOnDate('sp500', dates[count]);
    console.log('newPrice: ' + newPrice);
    const oldPrice = getIndexOnDate('sp500', dates[count - 1]);
    console.log('oldPrice: ' + oldPrice);
    let newValue = newPrice - oldPrice; // get price difference
    let percent = newPrice / oldPrice;
    percent -= 1;
    percent = Math.round(percent * 10000) / 100;
    if (percent > 0.0) {
      await onDisplayNotificationUp(percent);
    } else {
      await onDisplayNotificationDown(percent);
    }
    newValue = newValue * value; // multiply with the play (-1, 0 or 1) multiplied with leverage (1 ... 20)
    return user.accountVal + newValue;
  }
  async function submitfunction() {
    setCounter(counter + 1);
    console.log('Counter: ' + counter);
    if (counter === 4) {
      setUser({
        id: user.id,
        userlevel: 2,
        accountVal: user.accountVal,
      });
      await levelUp(2);
    }
    if (counter > 0 && counter < 6) {
      setDate(dates[counter - 1]);
      setUser({
        id: user.id,
        userlevel: user.userlevel,
        accountVal: updateAccountValue(counter - 1),
      });
      setValue(0);
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <StatusBar />
        <View style={styles.container}>
          {counter === 0 ? (
            <>
              <Text>Explanation of this Demo</Text>
              <Button title="Submit" onPress={() => submitfunction()} />
            </>
          ) : null}
          {counter > 0 && counter < 6 ? (
            <>
              <StatusBar />
              <Text>{date}</Text>
              {/* TOP OF THE SCREEN: STOCK CHARTS OF LAST 5 DAYS */}
              <View style={styles.chartcontainer}>
                <Victory title="SP 500" data={sp500} color={sp500Color} />
                <Victory title="DAX" data={dax} color={daxColor} />
                <Victory title="Nasdaq" data={nasdaq} color={nikkeiColor} />
              </View>
              {/* SECOND ON THE SCREEN: TOP NEWS OF THE DAY */}
              <FTNews date={date} />
              {/* THIRD ELEMENT IS THE SLIDER(S) */}
              {user.userlevel === 2 ? (
                <Level2slider value={value} setValue={setValue} />
              ) : (
                <Level1slider value={value} setValue={setValue} />
              )}
              {/* FINALLY THE SUBMIT BUTTON */}
              <Button title="Submit" onPress={() => submitfunction()} />
            </>
          ) : null}
          {counter === 6 ? (
            <View>
              <Text>Congratulations you finished the Demo</Text>
              <Text>Your new Account Value is: {user.accountVal}</Text>
              <Button
                title="Reset"
                onPress={() => {
                  setCounter(0);
                  setUser({
                    id: user.id,
                    userlevel: 1,
                    accountVal: 1000,
                  });
                }}
              />
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartcontainer: {
    flexDirection: 'row',
  },
  input: {
    borderColor: 'gray',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});

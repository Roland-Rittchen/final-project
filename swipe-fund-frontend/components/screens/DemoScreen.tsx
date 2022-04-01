import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
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
  const [direction, setDirection] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
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
  const ref = useRef<ScrollView>(null);

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
    const oldPrice = getIndexOnDate('sp500', dates[count - 1]);
    let newValue = newPrice - oldPrice; // get price difference
    newValue = newValue * value; // multiply with the play (-1, 0 or 1) multiplied with leverage (1 ... 20)
    newValue = user.accountVal + newValue;
    let percent = newValue / user.accountVal;
    percent -= 1;
    percent = Math.round(percent * 10000) / 100;
    if (percent > 0.0) {
      await onDisplayNotificationUp(percent);
    }
    if (percent < 0.0) {
      await onDisplayNotificationDown(percent);
    }
    return newValue;
  }

  async function submitfunction() {
    const tmpCounter = counter + 1;
    setCounter(tmpCounter);
    if (tmpCounter === 4) {
      await levelUp(2);
    }
    if (tmpCounter > 0 && tmpCounter < 6) {
      setDate(dates[tmpCounter - 1]);
      if (tmpCounter > 1) {
        const accountValUpdate = await updateAccountValue(tmpCounter - 1);
        setUser({
          id: user.id,
          username: user.username,
          userlevel: tmpCounter === 4 ? user.userlevel + 1 : user.userlevel,
          accountVal: accountValUpdate,
        });
      }
      setValue(0);
      setDirection(0);
      setMultiplier(1);
    }
    ref.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  return (
    <ScrollView ref={ref}>
      <StatusBar />
      <View style={styles.container}>
        {counter === 0 ? (
          <>
            <View style={styles.subcontainer}>
              <Text style={styles.h1}>Welcome to the Demo</Text>
              <Text>
                Over the next screens you will simulate 5 days of action. Every
                screen is one day of news. Look at the charts, read the news and
                make your informed decision.
              </Text>
            </View>
            <Pressable onPress={() => submitfunction()}>
              <View style={styles.userContainerButton}>
                <Text style={styles.userTextButton}>Start</Text>
              </View>
            </Pressable>
          </>
        ) : null}
        {counter > 0 && counter < 6 ? (
          <View style={styles.subcontainer}>
            <Text>Demo date: {date}</Text>
            {/* TOP OF THE SCREEN: STOCK CHARTS OF LAST 5 DAYS */}
            <View style={styles.chartcontainer}>
              <Victory title="SP 500" data={sp500} color={sp500Color} />
              <Victory title="DAX" data={dax} color={daxColor} />
              <Victory title="Nasdaq" data={nasdaq} color={nikkeiColor} />
            </View>
            {/* SECOND ON THE SCREEN: TOP NEWS OF THE DAY */}
            <FTNews date={date} />
            {/* THIRD ELEMENT IS THE SLIDER(S) */}
            <Text style={styles.h2}>Your Turn</Text>
            {user.userlevel === 2 ? (
              <Level2slider
                setValue={setValue}
                direction={direction}
                setDirection={setDirection}
                multiplier={multiplier}
                setMultiplier={setMultiplier}
              />
            ) : (
              <Level1slider value={value} setValue={setValue} />
            )}
            {/* FINALLY THE SUBMIT BUTTON */}
            <Pressable
              onPress={async () => {
                await submitfunction();
              }}
            >
              <View style={styles.userContainerButton}>
                <Text style={styles.userTextButton}>Submit</Text>
              </View>
            </Pressable>
          </View>
        ) : null}
        {counter === 6 ? (
          <View style={styles.subcontainer}>
            <Text style={styles.h1}>Congratulations you finished the Demo</Text>
            <Text>Your new Account Value is: </Text>
            <Text>{user.accountVal.toFixed(2)}</Text>
            <Pressable
              onPress={() => {
                setCounter(0);
                setUser({
                  id: user.id,
                  username: user.username,
                  userlevel: 1,
                  accountVal: 1000,
                });
              }}
            >
              <View style={styles.userContainerButton}>
                <Text style={styles.userTextButton}>Reset</Text>
              </View>
            </Pressable>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',

    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subcontainer: {
    margin: 25,
    width: '90%',
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
  userContainerButton: {
    backgroundColor: '#6DA10B',
    width: 350,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    padding: 20,
    margin: 15,
    borderRadius: 15,
  },
  userTextButton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  h1: {
    color: '#6DA10B',
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 25,
  },
  h2: {
    color: '#6DA10B',
    fontWeight: 'bold',
    fontSize: 25,
    marginLeft: 40,
    marginTop: 25,
  },
});

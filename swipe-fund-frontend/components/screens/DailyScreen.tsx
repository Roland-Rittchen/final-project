import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { data, FTdata } from '../../data/finacialTimes';
import Victory from '../VictoryChart';
import {
  VictoryData,
  getVictoryChartData,
  getColor,
} from '../../data/stockPrices';

export default function Daily() {
  const [news, setNews] = useState<FTdata[]>();
  const [sp500, setSp500] = useState<VictoryData>(getVictoryChartData('sp500'));
  const [sp500Color, setSp500Color] = useState<string>(getColor('sp500'));
  const [dax, setDax] = useState<VictoryData>(getVictoryChartData('dax'));
  const [daxColor, setDaxColor] = useState<string>(getColor('dax'));
  const [nasdaq, setNasdaq] = useState<VictoryData>(
    getVictoryChartData('nasdaq'),
  );
  const [nikkeiColor, setNikkeiColor] = useState<string>(getColor('nasdaq'));

  const getChart = useCallback(() => {
    setSp500(getVictoryChartData('sp500'));
    setSp500Color(getColor('sp500'));
    setDax(getVictoryChartData('dax'));
    setDaxColor(getColor('dax'));
    setNasdaq(getVictoryChartData('nasdaq'));
    setNikkeiColor(getColor('nasdaq'));
  }, []);
  const fetchNews = useCallback(() => {
    const tmpNews = data; // await getYahooNews('2022-03-18'); // getNews('2022-03-24');
    // console.log(tmpNews);
    // tmpNews.length = 3;
    setNews(tmpNews);
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <StatusBar />
        <View style={styles.container}>
          <Text>Daily Screen</Text>
          <Button title="Get new Chart" onPress={() => getChart()} />
          <View style={styles.chartcontainer}>
            <Victory title='SP 500' data={sp500} color={sp500Color} />
            <Victory title='DAX' data={dax} color={daxColor} />
            <Victory title='Nasdaq' data={nasdaq} color={nikkeiColor} />
          </View>
          <Button title="Get the News" onPress={() => fetchNews()} />
          {news
            ? news.map((newsItem) => {
                return (
                  <View
                    key={newsItem.image + newsItem.date}
                    style={styles.newsItemContainer}
                  >
                    <View style={styles.newsItemImageContainer}>
                      <Image
                        source={{
                          uri: newsItem.image,
                        }}
                        style={{ width: 75, height: 42 }}
                      />
                    </View>
                    <View style={styles.newsItemNewsContainer}>
                      <Text style={styles.newsItemTag}>{newsItem.tag}</Text>
                      <Text style={styles.newsItemHeadline}>
                        {newsItem.heading}
                      </Text>
                      <Text style={styles.newsItemTeaser}>
                        {newsItem.teaser}
                      </Text>
                    </View>
                  </View>
                );
              })
            : null}
        </View>
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
  input: {
    borderColor: 'gray',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  chartcontainer: {
    flexDirection: 'row',
  },
  newsItemContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 5,
  },
  newsItemImageContainer: {
    flex: 1,
    marginTop: 15,
    padding: 3,
  },
  newsItemNewsContainer: {
    flex: 4,
    padding: 3,
  },
  newsItemTag: {
    fontWeight: '200',
    fontSize: 15,
  },
  newsItemHeadline: {
    fontWeight: '600',
    fontSize: 25,
  },
  newsItemTeaser: {
    fontWeight: '300',
    fontSize: 15,
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
});

// style={{ width: '100%', height: '100%' }}
// width: '20',

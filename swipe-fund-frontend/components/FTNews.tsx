import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FTdata, getDateNews } from '../data/finacialTimes';

export function FTNews(props: { date: string }) {
  const [news, setNews] = useState<FTdata[]>();

  useEffect(() => {
    const tmpNews = getDateNews(props.date);
    setNews(tmpNews);
  }, [props]);

  return (
    <View style={styles.container}>
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
                  <Text style={styles.newsItemTeaser}>{newsItem.teaser}</Text>
                </View>
              </View>
            );
          })
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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

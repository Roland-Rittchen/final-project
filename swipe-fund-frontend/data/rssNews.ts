import * as rssParser from 'react-native-rss-parser';

const urls = [
  'https://cdn.mysitemapgenerator.com/shareapi/rss/2403400518', // content
  'https://rss.app/feeds/c2kh0T3yqomUdEwJ.xml', // description
  'https://www.reddit.com/r/wallstreetbets.rss', // content
  'https://www.investing.com/rss/news.rss',
  'http://feeds.marketwatch.com/marketwatch/topstories/',
  'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664',
  'https://seekingalpha.com/market_currents.xml',
];

async function fetcher(date: string, url = urls[2]) {
  const feed: rssParser.FeedItem[] = [];
  await fetch(url)
    .then((response) => response.text())
    .then((responseData) => rssParser.parse(responseData))
    .then((rss) => {
      const items = rss.items;
      // console.log(items);
      const itemsOnDate = items.filter((it: rssParser.FeedItem) =>
        it.published.includes(date),
      );
      feed.push(...itemsOnDate);
      // console.log(feed);
      // console.log(rss.title);
      // console.log(rss.items.length);
    });
  return feed;
}

export async function getNews(date: string) {
  return await fetcher(date);
}

/*
{news
          ? news.map((newsItem) => {
              const title = newsItem.title;
              const html = newsItem.content;
              if (title && html) {
                return (
                  <View key={newsItem.id}>
                    <Text>{title}</Text>
                    <View style={{ flex: 1 }}>
                      <WebView source={{ html }} />
                    </View>
                  </View>
                );
              } else {
                return <Text>No news right now</Text>;
              }
            })
          : null}
          */

import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { getNews } from '../util/news';
// We'll get to this one later
import { Article } from './Article';

export const News = () => {
  // : React.FC
  const tempArticle = {
    source: {
      id: 'usa-today',
      name: 'USA Today',
    },
    author: 'Ellen J. Horrow, USA TODAY',
    title:
      'NASCAR at Fontana 2022: Start time, TV, streaming schedule, lineup for Auto Club Speedway race - USA TODAY',
    description:
      "All the information you need to get ready for Sunday's WISE Power 400 NASCAR Cup Series race at Auto Club Speedway in Fontana, California.",
    url: 'https://www.usatoday.com/story/sports/nascar/2022/02/27/fontana-race-2022-start-time-tv-live-stream-lineup/6933061001/',
    urlToImage:
      'https://www.gannett-cdn.com/presto/2022/02/25/USAT/8947744c-9728-43ab-ac62-46433bd977cf-bowman.jpg?auto=webp&crop=3510,1975,x1319,y789&format=pjpg&width=1200',
    publishedAt: '2022-02-27T12:32:43Z',
    content:
      'The NASCAR Cup Series returns to Southern California for a points race for the first time since 2020 with the WISE Power 400 at Auto Club Speedway. \r\nSince 1997, the Fontana, California, track had ho… [+3485 chars]',
  };
  const [articles, setArticles] = useState([tempArticle]);

  function fetchNews() {
    getNews()
      .then((res) => setArticles(res))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <FlatList
      data={articles}
      renderItem={(item) => <Article item={item.item} />} // singleArticle={item}
      keyExtractor={(item) => item.url}
    />
  );
};

import { css } from '@emotion/native';
import moment from 'moment'; // MomentInput
import React from 'react';
import { Linking, TouchableNativeFeedback, View } from 'react-native';
import { Card, Divider, Text } from 'react-native-elements';

// export type ArticleProps = {
//   item: {
//     article: {
//       source: {
//         id: String,
//         name: String,
//       },
//       // author: String;
//       title: string,
//       description: String,
//       url: string,
//       urlToImage: string,
//       publishedAt: MomentInput, // "2022-02-27T12:32:43Z"
//       // content: String;
//     },
//   },
// };

const noteStyle = css`
{
    margin: 5,
    font-style: 'italic',
    color: '#b2bec3',
    font-size: 10,
  }`;

const featuredTitleStyle = css`{
    margin-left: 5,
    margin-right: 5,
    text-shadow: 3 3 3 '#00000f',
  }`;

export const Article = (props) => {
  // const {
  //   // author,
  //   title,
  //   description,
  //   publishedAt,
  //   source,
  //   urlToImage,
  //   url,
  //   // content,
  // } = props;
  const time = moment(props.item.publishedAt).fromNow();
  // const defaultImg = 'https://wallpaper.wiki/wp-content/uploads/2017/04/wallpaper.wiki-Images-HD-Diamond-Pattern-PIC-WPB009691.jpg';

  return (
    <TouchableNativeFeedback
      useForeground
      onPress={() => Linking.openURL(props.item.url)}
    >
      <Card style={{ backgroundColor: 'transparent' }}>
        <Card.FeaturedTitle style={featuredTitleStyle}>
          {props.item.title}
        </Card.FeaturedTitle>
        <Card.Image
          source={{
            uri: props.item.urlToImage,
          }}
        />
        <Text style={{ marginBottom: 10 }}>{props.item.description}</Text>
        <Divider style={{ backgroundColor: '#dfe6e9' }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={noteStyle}>{props.item.source.name.toUpperCase()}</Text>
          <Text style={noteStyle}>{time}</Text>
        </View>
      </Card>
    </TouchableNativeFeedback>
  );
};

/*
{

    -
    "source": {
        "id": "usa-today",
        "name": "USA Today"
    },
    "author": "Ellen J. Horrow, USA TODAY",
    "title": "NASCAR at Fontana 2022: Start time, TV, streaming schedule, lineup for Auto Club Speedway race - USA TODAY",
    "description": "All the information you need to get ready for Sunday's WISE Power 400 NASCAR Cup Series race at Auto Club Speedway in Fontana, California.",
    "url": "https://www.usatoday.com/story/sports/nascar/2022/02/27/fontana-race-2022-start-time-tv-live-stream-lineup/6933061001/",
    "urlToImage": "https://www.gannett-cdn.com/presto/2022/02/25/USAT/8947744c-9728-43ab-ac62-46433bd977cf-bowman.jpg?auto=webp&crop=3510,1975,x1319,y789&format=pjpg&width=1200",
    "publishedAt": "2022-02-27T12:32:43Z",
    "content": "The NASCAR Cup Series returns to Southern California for a points race for the first time since 2020 with the WISE Power 400 at Auto Club Speedway. \r\nSince 1997, the Fontana, California, track had ho… [+3485 chars]"

}

<Text>{JSON.stringify(props)}</Text>;

*/

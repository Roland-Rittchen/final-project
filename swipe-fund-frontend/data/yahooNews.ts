const newsRegistry = [
  {
    date: '2022-03-18',
    link: 'https://finance.yahoo.com/news/the-truth-about-record-high-stock-buybacks-morning-brief-090912155.html',
  },
];

const getRawData = (URL: string) => {
  return fetch(URL)
    .then((response) => response.text())
    .then((data) => {
      return data;
    });
};

// function cleanRawHtml(rawHtml: string) {
//   const indexStart = rawHtml.indexOf('<article');
//   const rawMinusFront = rawHtml.slice(indexStart);
//   // console.log(rawMinusFront.slice(0, 10));
//   const indexEnd = rawMinusFront.indexOf('</article>');
//   const sliceEnd = rawMinusFront.length - indexEnd - 10;
//   const middle = rawMinusFront.slice(0, -sliceEnd);
//   // console.log(middle.slice(-10));

//   return middle;
// }

function cleanRawHtml(rawHtml: string) {
  const indexStart = rawHtml.indexOf('caas-content');
  console.log(indexStart);
  const rawMinusFront = rawHtml.slice(indexStart - 8);
  console.log(rawMinusFront.slice(0, 100));
  const indexEnd = rawMinusFront.indexOf('</article>');
  const sliceEnd = rawMinusFront.length - indexEnd - 10;
  const middle = rawMinusFront.slice(0, -sliceEnd);
  console.log(middle.slice(-100));

  return middle;
}

// function cleanMiddleHtml(middleHtml: string) {
//   const indexStart = middleHtml.indexOf('aas-content-w'); //<div class="
//   console.log(indexStart);
//   const rawMinusFront = middleHtml.slice(indexStart - 12);
//   // console.log(rawMinusFront.slice(0, 20));
//   // const indexEnd = rawMinusFront.indexOf('</article>');
//   // const sliceEnd = rawMinusFront.length - indexEnd - 10;
//   // const middle = rawMinusFront.slice(0, -35);
//   // console.log(middle.slice(-20));

//   return middle;
// }

export async function getYahooNews(date: string) {
  // console.log('getYahooNews called');
  const newsPiece = newsRegistry.find((value) => value.date === date);
  // console.log('newsPiece: ' + newsPiece);
  if (newsPiece) {
    // console.log('if entered');
    const newsPieceSource = await getRawData(newsPiece.link);
    const filteredNewsPiece = cleanRawHtml(newsPieceSource);
    // const filteredNewsPiece = cleanMiddleHtml(preFilteredNewsPiece);
    // console.log(newsPieceSource);
    // const $ = cheerio.load(newsPieceSource); // cheerio.load(
    // console.log($);
    // const filteredNewsPiece = $.html(articleStart);
    // console.log(filteredNewsPiece);
    return filteredNewsPiece;
  }
}

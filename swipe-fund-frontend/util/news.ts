const url =
  'https://newsapi.org/v2/top-headlines?country=us&apiKey=c875b6d5bf5945e788592279b71f21d4';

export async function getNews() {
  const result = await fetch(url).then((response) => response.json());
  return result.articles;
}

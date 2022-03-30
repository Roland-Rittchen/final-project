type DataPoint = {
  date: string;
  nikkei: number;
  dax: number;
  nasdaq: number;
  sp500: number;
};

type Index = keyof DataPoint;

// s&p and nikkei from yahoo finance, dax nasdax NTV
const indices: Index[] = ['nikkei', 'dax', 'nasdaq', 'sp500'];
export const data: DataPoint[] = [
  {
    date: '2022-03-25',
    nikkei: 28149.84,
    dax: 14391.48,
    nasdaq: 14754.31,
    sp500: 4543.06,
  },
  {
    date: '2022-03-24',
    nikkei: 28110.39,
    dax: 14765.69,
    nasdaq: 14191.84,
    sp500: 4520.16,
  },
  {
    date: '2022-03-23',
    nikkei: 28040.16,
    dax: 14202.8,
    nasdaq: 14447.55,
    sp500: 4456.24,
  },
  {
    date: '2022-03-22',
    nikkei: 27224.11,
    dax: 14506.38,
    nasdaq: 14654.33,
    sp500: 4511.61,
  },
  {
    date: '2022-03-21',
    nikkei: 26827.43,
    dax: 14315.59,
    nasdaq: 14376.09,
    sp500: 4461.18,
  },
  {
    date: '2022-03-18',
    nikkei: 26827.43,
    dax: 14413.09,
    nasdaq: 14420.08,
    sp500: 4463.12,
  },
  {
    date: '2022-03-17',
    nikkei: 26652.89,
    dax: 14388.06,
    nasdaq: 14118.6,
    sp500: 4411.67,
  },
  {
    date: '2022-03-16',
    nikkei: 25762.01,
    dax: 14440.74,
    nasdaq: 13956.78,
    sp500: 4357.86,
  },
  {
    date: '2022-03-15',
    nikkei: 25346.48,
    dax: 13917.27,
    nasdaq: 13458.56,
    sp500: 4262.45,
  },
  {
    date: '2022-03-14',
    nikkei: 25307.85,
    dax: 13929.11,
    nasdaq: 13046.64,
    sp500: 4173.11,
  },
];

export function getLabels() {
  const labels = [];
  for (let i = 0; i < 5; i++) {
    labels.push(data[i].date);
  }
  return labels;
}

export function getIndex(index: Index, date: string) {
  const prices: number[] = [];
  const dI = getDateIndex(date);
  for (let i = dI; i < dI + 5; i++) {
    const tmp = data[i][index];
    if (typeof tmp === 'string') {
      prices.push(parseFloat(tmp));
    } else {
      prices.push(tmp);
    }
  }
  return prices;
}

export function getNormalizedIndex(index: Index, date: string) {
  // find the range of all indices
  const indexRange = [];
  for (const ind of indices) {
    const indPrices = getIndex(ind, date);
    const min = Math.min(...indPrices);
    const max = Math.max(...indPrices);
    const range = (max / min - 1) * 100;
    indexRange.push(range);
  }
  // get the maximum range
  const maxRange = Math.max(...indexRange);
  // normalize and center the requested Index
  const prices = getIndex(index, date);
  const avg =
    (Math.max(...prices) - Math.min(...prices)) / 2 + Math.min(...prices);
  return prices.map((price) => {
    const deviation = price - avg; // how many points away from the centerline
    const devPercent = (deviation / avg) * 100;
    // max range = 100 - devPercent = ?
    price = (devPercent / maxRange) * 100 + 50;
    return price;
  });
}

export function getColor(index: Index, date: string) {
  const i = getDateIndex(date);
  const newest = data[i][index];
  const oldest = data[i + 4][index];
  if (newest > oldest) {
    return '#6DA10B'; // 'rgb(109,161,11)';
  } else {
    return '#ED5334'; // rgb(237,83,52)';
  }
}

export type VictoryData = { x: number; y: number }[];

export function getVictoryChartData(index: Index, date: string) {
  const prices = getNormalizedIndex(index, date);
  const retData = [
    { x: 0, y: prices[4] },
    { x: 25, y: prices[3] },
    { x: 50, y: prices[2] },
    { x: 75, y: prices[1] },
    { x: 100, y: prices[0] },
  ];
  return retData;
}

function getDateIndex(date: string) {
  const dateIndex = (element: DataPoint) => element.date === date;
  return data.findIndex(dateIndex);
}

export function getIndexOnDate(index: Index, date: string) {
  if (index === 'date') {
    return 0;
  } else {
    const dataAtIndex = data[getDateIndex(date)];
    const val = dataAtIndex[index];
    return val;
  }
}

export const data = [
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

export function getIndex(index) {
  const prices = [];
  for (let i = 0; i < 5; i++) {
    [prices].push(data[i][index]);
  }
  return prices;
}

export function getColor(index) {
  const newest = data[0][index];
  const oldest = data[4][index];
  if (newest > oldest) {
    return 'rgb(109,161,11)';
  } else {
    return 'rgb(237,83,52)';
  }
}

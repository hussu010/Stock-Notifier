import { stockSymbolData } from './notifications.interface';

const binarySearchStockArray = (
  stockSymbolData: stockSymbolData[],
  symbol: string
): stockSymbolData => {
  let min = 0;
  let max = stockSymbolData.length - 1;
  let mid = 0;
  while (min <= max) {
    mid = Math.floor((min + max) / 2);
    if (stockSymbolData[mid].symbol === symbol) {
      return stockSymbolData[mid];
    } else if (stockSymbolData[mid].symbol < symbol) {
      min = mid + 1;
    } else {
      max = mid - 1;
    }
  }
  return { id: 0, symbol: '', name: '', type: '', sector_id: 0 };
};

export { binarySearchStockArray };

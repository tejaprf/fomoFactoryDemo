export interface PriceDetail {
    timestamp: number;
    price: number;
  }
  
  export interface TickerState {
    ticker: string;
    priceDetails: PriceDetail[];
  }
  
  export interface RootState {
    tickerState: TickerState | null;
  }
  
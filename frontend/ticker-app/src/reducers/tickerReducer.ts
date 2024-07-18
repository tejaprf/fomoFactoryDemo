import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import axios from 'axios';

interface PriceDetail {
  timestamp: number;
  price: number;
}

interface TickerState {
  ticker: string;
  tickers: string[];
  priceDetails: PriceDetail[];
  intervalId: NodeJS.Timeout | null; // Store interval ID for clearing later
}

const initialState: TickerState = {
  ticker: '',
  tickers: [],
  priceDetails: [],
  intervalId: null,
};

const tickerSlice = createSlice({
  name: 'ticker',
  initialState,
  reducers: {
    setTicker: (state, action: PayloadAction<string>) => {
      state.ticker = action.payload;
    },
    setTickers: (state, action: PayloadAction<string[]>) => {
      state.tickers = action.payload;
    },
    setPriceDetails: (state, action: PayloadAction<PriceDetail[]>) => {
      state.priceDetails = action.payload;
    },
    addPriceDetail: (state, action: PayloadAction<PriceDetail>) => {
      state.priceDetails.push(action.payload);
      if (state.priceDetails.length > 20) {
        state.priceDetails.shift(); // Remove oldest price detail if more than 20
      }
    },
    setIntervalId: (state, action: PayloadAction<NodeJS.Timeout | null>) => {
      state.intervalId = action.payload;
    },
  },
});

export const { setTicker, setTickers, setPriceDetails, addPriceDetail, setIntervalId } = tickerSlice.actions;

// Thunk action to fetch tickers from API
export const fetchTickers = (): AppThunk => async (dispatch) => {
  try {
    const response = await axios.get<string[]>(`${process.env.REACT_APP_SERVER_URL}/api/stocks`);
    dispatch(setTickers(response.data));
  } catch (error) {
    console.error('Error fetching tickers:', error);
  }
};

// Thunk action to fetch latest 20 price details for a specific ticker
export const fetchLatestPriceDetails = (ticker: string): AppThunk => async (dispatch) => {
  try {
    const response = await axios.get<PriceDetail[]>(`${process.env.REACT_APP_SERVER_URL}/api/price/${ticker}`);
    dispatch(setPriceDetails(response.data));
  } catch (error) {
    console.error(`Error fetching latest price details for ${ticker}:`, error);
  }
};

// Thunk action to start periodic fetching of latest price details
export const startFetchInterval = (ticker: string): AppThunk => async (dispatch, getState) => {
  // Clear existing interval if it exists
  const { intervalId } = getState().ticker;
  if (intervalId) {
    clearInterval(intervalId);
  }

  // Start new interval to fetch latest price details every 3000ms (3 seconds)
  const id = setInterval(async () => {
    try {
      const response = await axios.get<PriceDetail[]>(`${process.env.REACT_APP_SERVER_URL}/api/prices/${ticker}`);
      dispatch(setPriceDetails(response.data));
    } catch (error) {
      console.error(`Error fetching latest price details for ${ticker}:`, error);
    }
  }, 3000);

  // Store the interval ID in state
  dispatch(setIntervalId(id));
};

// Thunk action to stop periodic fetching of price details
export const stopFetchInterval = (): AppThunk => async (dispatch, getState) => {
  const { intervalId } = getState().ticker;
  if (intervalId) {
    clearInterval(intervalId);
    dispatch(setIntervalId(null)); // Clear interval ID in state
  }
};

export const selectTicker = (state: RootState) => state.ticker.ticker;
export const selectTickers = (state: RootState) => state.ticker.tickers;
export const selectPriceDetails = (state: RootState) => state.ticker.priceDetails;

export default tickerSlice.reducer;

import { ActionTypes, SET_TICKER, ADD_PRICE_DETAIL } from './types';
import { PriceDetail } from '../types/types';

export const setTicker = (ticker: string): ActionTypes => ({
  type: SET_TICKER,
  payload: ticker,
});

export const addPriceDetail = (priceDetail: PriceDetail): ActionTypes => ({
  type: ADD_PRICE_DETAIL,
  payload: priceDetail,
});

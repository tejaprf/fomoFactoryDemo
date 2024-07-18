import { PriceDetail } from "../types/types";

export const SET_TICKER = 'SET_TICKER';
export const ADD_PRICE_DETAIL = 'ADD_PRICE_DETAIL';

interface SetTickerAction {
  type: typeof SET_TICKER;
  payload: string;
}

interface AddPriceDetailAction {
  type: typeof ADD_PRICE_DETAIL;
  payload: PriceDetail;
}

export type ActionTypes = SetTickerAction | AddPriceDetailAction;

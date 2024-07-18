import { combineReducers } from '@reduxjs/toolkit';
import tickerReducer from './tickerReducer';

const rootReducer = combineReducers({
  ticker: tickerReducer,
});

export default rootReducer;

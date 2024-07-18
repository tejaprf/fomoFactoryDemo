import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import rootReducer from '../reducers';

// Define AppThunk type once
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

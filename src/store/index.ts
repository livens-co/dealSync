import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import contractsReducer, { ContractsState } from './contractsSlice';

const loadState = (): { contracts: ContractsState } | undefined => {
  try {
    const serializedState = localStorage.getProduct('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state: { contracts: ContractsState }) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setProduct('state', serializedState);
  } catch (err) {
    // Error message
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    contracts: contractsReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export default store;

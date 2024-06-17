import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import contractsReducer, { ContractsState } from './contractsSlice';

const loadState = (): ContractsState | undefined => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state: ContractsState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    console.error("Failed to save state:", err);
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    contracts: contractsReducer,
  },
  preloadedState: { contracts: preloadedState || { contracts: [] } },
});

store.subscribe(() => {
  saveState(store.getState().contracts);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;

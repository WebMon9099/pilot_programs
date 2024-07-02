import { createStore } from 'redux';
import reducers from './state/reducers';

const enhancer =
  /* @ts-ignore */
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  /* @ts-ignore */
  window.__REDUX_DEVTOOLS_EXTENSION__();

export const store = createStore(
  reducers,
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? enhancer
    : undefined
);

export type RootState = ReturnType<typeof store.getState>;

export type RootDispatch = typeof store.dispatch;

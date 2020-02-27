import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import me from './me/me';
import auth from './auth/auth';

const reducers = combineReducers({ me, auth });

const storeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const Store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk)),
);

export type State = ReturnType<typeof Store.getState>;

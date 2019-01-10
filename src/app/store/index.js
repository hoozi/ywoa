import { init } from '@rematch/core';
import { createHashHistory } from 'history';
import  createLoadingPlugin  from '@rematch/loading';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import base from './models/base';
import app from './models/app';
import user from './models/user';
import analysis from './models/analysis';
import contract from './models/contract';

const history = createHashHistory();

const loadingOptions = {}

const loading = createLoadingPlugin(loadingOptions)

const redux = {
  middlewares: [routerMiddleware(history)],
  reducers: {
    router: connectRouter(history)
  }
}

const store = init({
  models: {
    base,
    app, 
    user,
    analysis,
    contract
  },
  redux,
  plugins: [loading]
});

export { 
  history
};
export default store
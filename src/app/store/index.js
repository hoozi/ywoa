import { init } from '@rematch/core';
import { createHashHistory } from 'history';
import  createLoadingPlugin  from '@rematch/loading';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import app from './models/app';
import user from './models/user';

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
    app, 
    user
  },
  redux,
  plugins: [loading]
});

export { 
  history
};
export default store
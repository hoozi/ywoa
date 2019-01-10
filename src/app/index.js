
// 汉化
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

import store, { history } from './store';
import React from 'react';
import { Provider } from 'react-redux';
import Router from './router';

const createApp = (store, history) => (
  <LocaleProvider locale={zh_CN}>
    <Provider store={store}>
      <Router history={history} />
    </Provider>
  </LocaleProvider>
);
export default createApp(store, history);


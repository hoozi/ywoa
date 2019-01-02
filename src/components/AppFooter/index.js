import React from 'react';
import styles from './index.less';
import classnames from 'classnames';

export default ({theme, children, ...restProps}) => (
  <div className={classnames({[styles.appFooterLight]: theme === 'light'}, styles.appFooter)} {...restProps}>
    {children}
  </div>
);
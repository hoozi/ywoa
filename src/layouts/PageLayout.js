import React from 'react';
import classnames from 'classnames';
import styles from './PageLayout.less';
import Breadcrumb from '@/components/Breadcrumb'

export default ({ children, extra, showBreadcrumb = true, content, headFixed }) => {
  const classname = classnames(styles.pageHeader , {
    [styles.pageHeaderFixed]: !!headFixed
  });
  return (
    <div className='page-layout'>
      <div className={classname}>
        <div className={styles.pageHeaderTop}>
          {showBreadcrumb && <Breadcrumb/>}
          { extra && <div className={styles.extra}>{extra}</div>}
        </div>
        {content && <div className={styles.content}>{content}</div>}
      </div>
      <div className={styles.pageContent}>{children}</div>
    </div>
  )
}
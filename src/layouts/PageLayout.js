import React from 'react';
import styles from './PageLayout.less';
import Breadcrumb from '@/components/Breadcrumb'

export default ({ children, extra, showBreadcrumb = true }) => {
  return (
    <div className='page-layout'>
      <div className={styles.pageHeader}>
        {showBreadcrumb && <Breadcrumb/>}
        { extra && <div className={styles.extra}>{extra}</div>}
      </div>
      <div className={styles.pageContent}>{children}</div>
    </div>
  )
}
import React from 'react';
import { Row, Col, Icon } from 'antd';
import styles from './RoomList.less';

const colorMap = [
  {
    name: '已出租',
    theme: '#65b157'
  },
  {
    name: '即将到期',
    theme: '#faad14'
  },
  {
    name: '未出租',
    theme: '#c2c5d4'
  }
]
const getColor = item => {
  const { isRented, isOut } = item;
  if(isRented) {
    if(isOut) {
      return colorMap[1]['theme'];
    } else {
      return colorMap[0]['theme'];
    }
  } else {
    return colorMap[2]['theme'];
  }
  return '';
}
function noop() {}
export default ({ data, onGetCurrentRoom = noop }) => {
  
  return (
    <div className={styles.roomList}>
      <div className={styles.legend}>
        {
          colorMap.map(item => (
            <div className={styles.legendItem} key={item.theme}>
              <span className={styles.legendDot} style={{backgroundColor: item.theme}}></span>
              <span className={styles.legendName}>{item.name}</span>
            </div>
          ))
        }
      </div>
      <Row gutter={4}>
        {
          data.map((item, index) => (
            <Col xxl={4} lg={4} xl={4} md={6} sm={6} xs={6} key={item}>
              <div className={styles.roomItem} onClick={() => onGetCurrentRoom(index)}>
                <Icon type='home' theme='filled' style={{fontSize: 13}}/>
                <span className={styles.roomName}>A403-A4041(96m²)</span> 
              </div>
            </Col>
          ))
        }
      </Row>
    </div>
  )
}
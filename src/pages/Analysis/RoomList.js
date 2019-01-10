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
            <Col span={6} key={item.id}>
              <div className={styles.roomItem} onClick={() => onGetCurrentRoom(!item.isRented ? -1 : index)} style={{backgroundColor: getColor(item)}}>
                <Icon type='home' theme='filled' style={{fontSize: 13}}/>
                <span className={styles.roomName}><b>{item.roomName}</b> {item.size}m²</span> 
              </div>
            </Col>
          ))
        }
      </Row>
    </div>
  )
}
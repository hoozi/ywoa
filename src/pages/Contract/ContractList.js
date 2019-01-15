import React, { Component } from 'react';
import {
  Card,
  List,
  Button,
  Row,
  Icon,
  Tag,
  Col
} from 'antd';
import map from 'lodash/map';
import { Ellipsis } from 'ant-design-pro';
import styles from './ContractList.less';

const fieldMap = {
  'companyName': '公司',
  'renter': '法人',
  'tel': '电话'
}
const payStatus = [
  {
    color: 'red',
    text: '租金未支付'
  },
  {
    color: 'green',
    text: '租金已支付'
  }
]

const getColor = item => {
  const { valid, isOut } = item;
  if(valid) {
    if(isOut) {
      return '#faad14';
    } else {
      return '#65b157';
    }
  } else {
    return '#c2c5d4';
  }
}
const codeContent = item  => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between'
  }}>
    <a>编号{item.code}</a>
    {
      !item.valid ?
      <Tag style={{margin: 0}}>合同已到期</Tag> :
      <Tag style={{margin: 0}} color={payStatus[item.chargeFlag].color}>{payStatus[item.chargeFlag].text}</Tag>
    }
  </div>
);

const getDescription = data => map(data, (value, key)=> {
  return (
    fieldMap[key] ? 
    <div className={styles.descriptionItem} key={key}>
      <span className={styles.descriptionLabel}>{fieldMap[key]}</span>
      <span className={styles.descriptionValue}><Ellipsis lines={1}>{value}</Ellipsis></span>
    </div> : 
    null
  )
})

export default class ContractList extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.loading != this.props.loading
  }
  render() {
    const { data, loading, pagination={}, onShowInfo, onEdit, onContinue, onThrow, onAddData, ...restProps } = this.props
    return (
      <List
        rowKey='id'
        grid={{ gutter: 16, lg: 3, md: 2, sm: 1, xs: 1 }}
        dataSource={[{id: '-1'}, ...data]}
        loading={loading}
        pagination={pagination}
        {...restProps}
        renderItem={item => (
          item.id >= 0 ? 
          <List.Item key={item.id}>
            <Card 
              hoverable
              className={styles.card} 
              style={{borderLeft: `2px solid ${getColor(item)}`}}
              bodyStyle={{padding: '24px 16px'}}
              actions={[
                <span onClick={e => {
                  e.stopPropagation();
                  onEdit && onEdit(item);
                } }><Icon type='setting' /> 管理</span>, 
                /* <span onClick={e => {
                  e.stopPropagation();
                  onContinue && onContinue(item);
                }}><Icon type='edit' /> 续租</span>, */
                <span onClick={e => {
                  e.stopPropagation();
                  onThrow && onThrow(item);
                }}><Icon type='delete' /> 退租</span>
              ]}
            >
              <Card.Meta
                title={codeContent(item)}
                description={getDescription(item)}
              />
            </Card>
          </List.Item> :
          <List.Item key={item.id}>
            <Button type='dashed' className={styles.newButton} onClick={() => onAddData && onAddData()}>
              <Icon type='plus'/> 添加合同
            </Button>
          </List.Item>
        )}
      />
    )
  }
}

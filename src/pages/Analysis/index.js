import React, { Component } from 'react';
import { Row, Col, Spin, Icon, Menu, /* Dropdown, */ Card, Radio, Drawer } from 'antd'
import { Charts } from 'ant-design-pro';
import moment from 'moment';
import PageLayout from '@/layouts/PageLayout';
import styles from './index.less';
import { connect } from 'react-redux';
import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';
import { WaterIcon, PowerIcon, ContractIcon } from '@/components/EnergyIcon';
import { mapLoadingAndEffect } from '@/utils'
import FloorCascader from '@/components/FloorCascader';
import RoomList from './RoomList';
import EnergyAnalysis from './EnergyAnalysis';
import toPairs from 'lodash/toPairs';

TweenOne.plugins.push(Children);

const years = [
  moment().format('YYYY'), 
  moment().subtract(1, 'years').format('YYYY'),
  moment().subtract(2, 'years').format('YYYY')
]
const { ChartCard, Pie, yuan, WaterWave } = Charts;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 8,
  style: { marginBottom: 16 },
};
const fieldStyle = {
  textAlign: 'left', 
  color: 'rgba(0,0,0,.45)'
}
const getPieData = (originalData, fieldData) => {
  if(!originalData.length) return [];
  return fieldData.map((item, index) => {
    return {
      x: item,
      y: originalData[index]
    }
  });
}
const CardLoading = () => (
  <div style={{lineHeight: '80px', textAlign: 'center'}}><Spin/></div>
)
const mapStateToProps = ({ analysis, loading }) => ({
  ...analysis,
  ...mapLoadingAndEffect([
    'PowerAnalysis',
    'WaterAnalysis',
    'ContractCountAnalysis',
    'AreaAnalysis',
    'RentAnalysis',
    'RoomAnalysis'
  ], 'loading', loading, 'analysis')
});
const mapDispatchToProps = ({ analysis }) => ({
  ...mapLoadingAndEffect([
    'PowerAnalysis',
    'WaterAnalysis',
    'ContractCountAnalysis',
    'AreaAnalysis',
    'RentAnalysis',
    'RoomAnalysis'
  ], 'effect', null, analysis)
});

@connect(mapStateToProps, mapDispatchToProps)
class Analysis extends Component {
  state = {
    year: new Date().getFullYear(),
    pieType: 'rent',
    currentRoom: {},
    drawerVisible: false
  }
  getEnergyAnalysis(year) {
    const { 
      getPowerAnalysis, 
      getWaterAnalysis
    } = this.props
    getPowerAnalysis({year});
    getWaterAnalysis({year});
  }
  componentDidMount() {
    const { year } = this.state;
    const { 
      getContractCountAnalysis, 
      getAreaAnalysis,
      getRentAnalysis
    } = this.props
    this.getEnergyAnalysis(year);
    getContractCountAnalysis();
    getAreaAnalysis();
    ['OA','OB','WB'].forEach(code => {
      getRentAnalysis({code});
    })
  }
  handleSelectYearChange = ({key}) => {
    this.setState({year: key});
    this.getEnergyAnalysis(key)
  }
  handlepieType = e => {
    this.setState({pieType: e.target.value});
  }
  handleRoomAnalysis = value => {
    if(!value.length) return;
    const floorId = value[value.length-1];
    this.props.getRoomAnalysis({floorId});
  }
  handleRoomClick = index => {
    if(index < 0) return;
    const { roomList } = this.props;
    const currentRoom = roomList[index];
    this.handleDrawerShow(true);
    this.setState({currentRoom})
  }
  handleDrawerShow = flag => {
    this.setState({
      drawerVisible: !!flag
    });
  }
  renderSelectYear = () => (
    <Menu onClick={this.handleSelectYearChange}>
      {
        years.map(item=>(
          <Menu.Item key={item}>
            {item}年
          </Menu.Item>
        ))
      }
    </Menu>
  )
  renderPieCardExtra = () => (
    <RadioGroup 
      value={this.state.pieType} 
      size='small' 
      onChange={this.handlepieType}
      buttonStyle='solid'
    >
      <RadioButton value='rent'>租金</RadioButton>
      <RadioButton value='area'>租用面积</RadioButton>
    </RadioGroup>
  )
  render() {
    const { 
      power, 
      water, 
      contractCount, 
      area,
      rentOA,
      rentOB,
      rentWB,
      roomList,
      fetchPowerAnalysising, 
      fetchWaterAnalysising, 
      fetchContractCountAnalysising,
      fetchAreaAnalysising,
      fetchRentAnalysising,
      fetchRoomAnalysising
    } = this.props;
    const { year, pieType, drawerVisible, currentRoom } = this.state;
    const currentRooms = toPairs(currentRoom).map(item => [...item]);
    currentRooms.push(['se', `${moment(currentRoom.startTime).format('YYYY-MM-DD')} ~ ${moment(currentRoom.endTime).format('YYYY-MM-DD')}`])
    const fieldMap = {
      'code': '合同编号',
      'roomName': '房间号',
      'companyName': '公司名称',
      'rent': '租金',
      'renter': '法人',
      'tel': '联系电话',
      'se': '合同起止日期'
    }
    const pie = {
      rent: {
        name: '租金',
        data: getPieData([rentOA, rentOB, rentWB], ['A幢租金', 'B幢租金', '仓库租金'])
      },
      area: {
        name: '租用面积',
        data: getPieData(area, ['已租面积','未租面积'])
      }
    };
    const pieName = pie[pieType]['name'];
    const pieData = pie[pieType]['data'];
    const chartCardMap = [
      {
        title: `用电量(${year}年)`,
        theme: 'powerCard',
        icon: PowerIcon,
        loading: fetchPowerAnalysising,
        data: power.reduce((item, prev) => item+prev, 0)
      },
      {
        title: `用水量(${year}年)`,
        theme: 'waterCard',
        icon: WaterIcon,
        loading: fetchWaterAnalysising,
        data: water.reduce((item, prev) => item+prev, 0)
      },
      {
        title: '合同数',
        theme: 'contractCard',
        icon: ContractIcon,
        loading: fetchContractCountAnalysising,
        data: contractCount
      }
    ];
    let data = [];
    power.forEach((item, index) => {
      data.push({
        'month': `${index+1}月`,
        '用电量': item,
        '用水量': water[index]
      })
    })
    
    return (
      <PageLayout
        extra={
          /* eslint-disable */
          /*<Dropdown overlay={this.renderSelectYear()}>
            <a href='javascript:;'>{year}年<Icon type='caret-down'/></a>
          </Dropdown>*/
          null
        }
      >
        <Row gutter={16}>
          {
            chartCardMap.map((item, index) => (
              <Col span={24/chartCardMap.length} key={index} className={[styles[item.theme], styles.baseCard].join(' ')} {...topColResponsiveProps}>
                {
                  !item.loading ? 
                  <ChartCard
                    title={item.title}
                    avatar={
                      <Icon component={item.icon}/>
                    }
                    bordered={false}
                    bodyStyle={{padding: '4px 0 0 24px'}}
                    total={() => (
                      <span>{item.data}</span>
                    )}
                  /> : 
                  <CardLoading/>
                }
              </Col>
            ))
          }
        </Row>
        <Row gutter={16} style={{marginBottom: 16}}>
          <Col {...topColResponsiveProps} xl={12} style={{marginBottom: 0}}>
            <Card
              title={`水电月用量(${year}年)`}
              loading={fetchPowerAnalysising && fetchWaterAnalysising}
              bordered={false}
            >
              <EnergyAnalysis height={360} data={data}/>
            </Card>
          </Col>
          <Col {...topColResponsiveProps} xl={12} style={{marginBottom: 0}}>
            <Card
              title='各类占比'
              extra={this.renderPieCardExtra()}
              bordered={false}
              className={styles.proportion}
              loading={fetchAreaAnalysising && fetchRentAnalysising}
            >
              <h4>
                <span>{pieName}</span>
              </h4>
              <Pie
                hasLegend
                subTitle={`总${pieName}`}
                total={() => (
                  pieType === 'rent' ? <span
                    dangerouslySetInnerHTML={{
                      __html: yuan(pieData.reduce((pre, now) => now.y + pre, 0))
                    }}
                  /> : <span>{`${pieData.reduce((pre, now) => now.y + pre, 0)}m²`}</span>
                )}
                data={pieData}
                valueFormat={val => pieType === 'rent' ? <span dangerouslySetInnerHTML={{ __html: yuan(val) }} /> : <span>{`${val}m²`}</span>}
                height={327}
                lineWidth={4}
              />
            </Card>
          </Col>
        </Row>
        
        <Card
          title='房间租用情况统计'
          bordered={false}
          extra={
            <FloorCascader 
              placeholder='请选择楼层' 
              onChange={this.handleRoomAnalysis}
              getInitValue={this.handleRoomAnalysis}
              size='default'
            />
          }
          bodyStyle={{padding: 0}}
        >
          <Row gutter={0}>
            <Col span={4} style={{padding: 24, position: 'relative'}}>
              <div style={{
                textAlign: 'center'
              }}>
                {
                  fetchAreaAnalysising ? 
                  <Spin/> : 
                  <WaterWave
                    title='未租面积剩余'
                    height={161}
                    percent={parseInt(area[1]/area[2]*100)}
                  />
                } 
              </div>
            </Col> 
            <Col span={20} style={{padding: 24, borderLeft: '1px solid #e8e8e8', minHeight: 214}}>
              {
                fetchRoomAnalysising ? 
                <Spin/> : 
                <RoomList data={roomList} onGetCurrentRoom={this.handleRoomClick}/>
              }
            </Col>
          </Row>  
        </Card>        
        <Drawer
          title='房间租用信息'
          placement='right'
          width={360}
          closable={false}
          onClose={() => this.handleDrawerShow(false)}
          visible={drawerVisible}
        >
          {
            currentRooms.map((item, index) => {
              const field = item[0];
              const value = item[1];
              return (
                fieldMap[field] ? 
                <Row gutter={16} style={{marginBottom: index !== currentRooms.length -1 && 16}} key={field}>
                  <Col span={8} style={fieldStyle}>{fieldMap[field]}</Col>
                  <Col span={16}>{
                    field === 'rent' ? 
                    <span
                      dangerouslySetInnerHTML={{
                        __html: yuan(currentRoom.rent)
                      }}
                    /> : 
                    value
                  }
                  </Col>
                </Row> : 
                null
              )
            })
          }
        </Drawer>            
      </PageLayout>
    )
  }
}

export default Analysis;
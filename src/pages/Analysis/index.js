import React, { Component } from 'react';
import { Row, Col, Spin, Icon, Menu, Dropdown, Card, Radio } from 'antd'
import { Charts } from 'ant-design-pro';
import moment from 'moment';
import PageLayout from '@/layouts/PageLayout';
import styles from './index.less';
import { connect } from 'react-redux';
import { WaterIcon, PowerIcon, ContractIcon } from '@/components/EnergyIcon';
import FloorCascader from '@/components/FloorCascader';
import RoomList from './RoomList';
import EnergyAnalysis from './EnergyAnalysis';

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
  fetchPowering: loading.effects.analysis.fetchPowerAnalysis,
  fetchWatering: loading.effects.analysis.fetchWaterAnalysis,
  fetchContractCounting: loading.effects.analysis.fetchContractCountAnalysis,
  fetchAreaing: loading.effects.analysis.fetchAreaAnalysis,
  fetchRenting: loading.effects.analysis.fetchRentAnalysis
});
const mapDispatchToProps = ({ analysis }) => ({
  getPowerAnalysis: params => analysis.fetchPowerAnalysis(params),
  getWaterAnalysis: params => analysis.fetchWaterAnalysis(params),
  getContractCountAnalysis: () => analysis.fetchContractCountAnalysis(),
  getAreaAnalysis: () => analysis.fetchAreaAnalysis(),
  getRentAnalysis: params => analysis.fetchRentAnalysis(params)
});

@connect(mapStateToProps, mapDispatchToProps)
class Analysis extends Component {
  state = {
    year: new Date().getFullYear(),
    pieType: 'rent'
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
    this.getEnergyAnalysis(year)
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
      fetchPowering, 
      fetchWatering, 
      fetchContractCounting,
      fetchAreaing,
      fetchRenting
    } = this.props;
    const { year, pieType } = this.state;
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
        loading: fetchPowering,
        data: power.reduce((item, prev) => item+prev, 0)
      },
      {
        title: `用水量(${year}年)`,
        theme: 'waterCard',
        icon: WaterIcon,
        loading: fetchWatering,
        data: water.reduce((item, prev) => item+prev, 0)
      },
      {
        title: '合同数',
        theme: 'contractCard',
        icon: ContractIcon,
        loading: fetchContractCounting,
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
          <Dropdown overlay={this.renderSelectYear()}>
            <a href='javascript:;'>{year}年<Icon type='caret-down'/></a>
          </Dropdown>
        }
      >
        <Row gutter={16}>
          {
            chartCardMap.map((item, index) => (
              <Col span={24/chartCardMap.length} key={index} className={[styles[item.theme], styles.baseCard].join(' ')} {...topColResponsiveProps}>
                {
                  !item.loading ? <ChartCard
                    title={item.title}
                    avatar={
                      <Icon component={item.icon}/>
                    }
                    bordered={false}
                    bodyStyle={{padding: '4px 0 0 24px'}}
                    total={() => (
                      <span>{item.data}</span>
                    )}
                  /> : <CardLoading/>
                }
              </Col>
            ))
          }
        </Row>
        <Row gutter={16} style={{marginBottom: 16}}>
          <Col {...topColResponsiveProps} xl={12} style={{marginBottom: 0}}>
            <Card
              title={`水电月用量(${year}年)`}
              loading={fetchPowering && fetchWatering}
              bodyStyle={{paddingLeft: 0, paddingRight: 12}}
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
              loading={fetchAreaing && fetchRenting}
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
        <Row gutter={16}>
          <Col span={19}>
            <Card
              title='房间租用情况统计'
              bordered={false}
              extra={<FloorCascader placeholder='请选择楼层' onChange={value => console.log(value)}/>}
            >
              <RoomList data={[1,2,3,4,5,6,7,8]}/>   
            </Card>  
          </Col>
          <Col span={5}>
            <Card title='资源剩余' bordered={false} loading={fetchAreaing}>
              <div style={{textAlign: 'center'}}>
                <WaterWave
                  title='未租面积剩余'
                  height={161}
                  percent={parseInt(area[1]/area[2]*100)}
                />
              </div>
            </Card>
          </Col>
        </Row>         
                    
      </PageLayout>
    )
  }
}

export default Analysis;
import React, { Component } from 'react';
import { 
  List, 
  Button, 
  Icon, 
  Card, 
  Row, 
  Col, 
  Tag, 
  Drawer, 
  Radio, 
  Form, 
  Input,
  Select,
  Alert,
  DatePicker 
} from 'antd'
import { connect } from 'react-redux';
import { Ellipsis, Charts } from 'ant-design-pro';
import PageLayout from '@/layouts/PageLayout';
import styles from './index.less';
import map from 'lodash/map';
import isFunction from 'lodash/isFunction';
import { mapLoadingAndEffect } from '@/utils';
import searchFormMap from './searchFormMap';

const Meta = Card.Meta;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const feildMap = {
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
const codeContent = item => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between'
  }}>
    <span>编号{item.code}</span>
    {
      !item.valid ?
      <Tag style={{margin: 0}}>合同已到期</Tag> :
      <Tag style={{margin: 0}} color={payStatus[item.chargeFlag].color}>{payStatus[item.chargeFlag].text}</Tag>
    }
  </div>
);
const mapStateToProps = ({ contract, base, loading }) => ({
  ...contract,
  ...base,
  ...mapLoadingAndEffect([
    'Contract'
  ], 'loading', loading, 'contract')
});
const mapDispatchToProps = ({ contract, base }) => ({
  ...mapLoadingAndEffect([
    'Contract'
  ], 'effect', null, contract),
  ...mapLoadingAndEffect([
    'FloorsByArea'
  ], 'effect', null, base)
})
@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
class Contract extends Component {
  state = {
    drawerVisible: false,
    areaId: '11',
    searchValues: {}
  }
  getContractData(params) {
    const { getContract } = this.props;
    const { areaId } = this.state
    getContract({areaId, ...params});
  }
  getFloorsByAreaData(id) {
    const { getFloorsByArea } = this.props;
    getFloorsByArea(id)
  }
  componentDidMount() {
    this.getContractData();
    this.getFloorsByAreaData(this.state.areaId);
  }
  handleDrawerShow = flag => {
    this.setState({
      drawerVisible: !!flag
    })
  }
  handleAreaChange = areaId => {
    this.setState({ areaId });
    this.handleSearchReset();
  }
  handleSelectChange = (name, value) => {
    const { searchValues } = this.state
    this.setState({
      searchValues: {
        ...searchValues,
        [name]: value
      }
    })
  }
  handleContractSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const { searchValues } = this.state;
    form.validateFields((err, values) => {
      if(err) return;
      const { rangeDate } = values;
      if(rangeDate) {
        values.startTime = rangeDate[0].format('YYYY-MM-DD');
        values.endTime = rangeDate[1].format('YYYY-MM-DD');
        delete values['rangeDate'];
      }
      this.setState({
        searchValues: {
          ...searchValues,
          ...values
        }
      });
      this.getContractData(values)
    })
  }
  handleSearchReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      searchValues: {}
    });
    this.getContractData();
  }
  renderSearchFormItem(options) {
    const { form: { getFieldDecorator } } = this.props;
    return searchFormMap.map(item => {
      return (
        <Col md={8} sm={24} key={item.name}>
          <FormItem label={item.label}>
            {getFieldDecorator(item.name)( 
              !item.type ?  
              <Input {...item.props}/> :
              ( item.type === 'select' ?
                <Select {...item.props} onChange={ value => this.handleSelectChange(item.name, value) }>
                  {
                    (function(item){
                      return isFunction(item.options) ? item.options(options[item.name]) : item.options
                    })(item).map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
                  }
                </Select> : 
                <RangePicker {...item.props}/>
              )
            )}
          </FormItem>
        </Col>
      )
    })
  }
  renderDescription = data => map(data, (value, key)=> {
    return (
      feildMap[key] ? 
      <Row className={styles.descriptionItem} gutter={4} key={key}>
        <Col className={styles.descriptionLabel} span={3}>{feildMap[key]}</Col>
        <Col className={styles.descriptionValue} span={21}><Ellipsis lines={1}>{value}</Ellipsis></Col>
      </Row> : 
      null
    )
  })
  renderSearchForm = () =>{ 
    const { floors } = this.props
    return (
      <Form layout='inline' className={styles.cardListForm} onSubmit={this.handleContractSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {this.renderSearchFormItem({
            fmin: floors.map(item =>({ label: item.name, value: item.id }))
          })}
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type='primary' htmlType='submit' onClick={this.handleContractSearch}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} >
                重置
              </Button>
              <Button style={{ marginLeft: 8 }} >
                导出
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    )
  }
  render(){
    const { drawerVisible, areaId } = this.state;
    const { data: { records, total, current, size: pageSize }, fetchContracting } = this.props;
    const paginationProps = {
      total,
      current,
      pageSize: pageSize+1
    }
    return (
      <PageLayout
        content={this.renderSearchForm()}
        extra={
          <RadioGroup value={areaId} onChange={ e => this.handleAreaChange(e.target.value) }>
            <RadioButton value='11'>写字楼A</RadioButton>
            <RadioButton value='13'>写字楼B</RadioButton>
            <RadioButton value='10'>仓库</RadioButton>
            <RadioButton value='12'>配套用房</RadioButton>
            <RadioButton value='14'>二期</RadioButton>
          </RadioGroup>
        }
      >
        <Alert message={
          <span>
            本页共有 <b>{records.filter(item=>item.valid).length}</b> 份合同,租金共有 <b dangerouslySetInnerHTML={{__html: Charts.yuan(records.reduce((pre, cur)=>pre+cur.rent,0))}}></b> 元
          </span>
        } type='info' showIcon style={{marginBottom: 16}}/>
        <List
          grid={{ gutter: 16, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={['', ...records]}
          loading={fetchContracting}
          pagination={paginationProps}
          renderItem={item => (
            item ? 
            <List.Item>
              <Card 
                hoverable
                className={styles.card} 
                style={{borderLeft: `2px solid ${getColor(item)}`}}
                bodyStyle={{padding: '24px 16px'}}
                actions={[
                  <span><Icon type='setting' /> 管理</span>, 
                  <span><Icon type='edit' /> 续租</span>, 
                  <span><Icon type='delete' /> 退租</span>
                ]}
                onClick={() => this.handleDrawerShow(true)}
              >
                <Meta
                  title={codeContent(item)}
                  description={this.renderDescription(item)}
                />
              </Card>
            </List.Item> :
            <List.Item>
              <Button type='dashed' className={styles.newButton}>
                <Icon type='plus'/> 添加合同
              </Button>
            </List.Item>
          )}
        />
        <Drawer
          title='合同信息'
          placement='right'
          width={480}
          closable={false}
          onClose={() => this.handleDrawerShow(false)}
          visible={drawerVisible}
        >
          <p>1</p>
        </Drawer>
      </PageLayout>
    )
  }
}

export default Contract;
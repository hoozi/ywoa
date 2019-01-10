import React, { PureComponent } from 'react';
import { 
  Button, 
  Row, 
  Col, 
  Drawer, 
  Radio, 
  Form, 
  Input,
  Select,
  Alert,
  Tag,
  DatePicker 
} from 'antd'
import { connect } from 'react-redux';
import {  Charts } from 'ant-design-pro';
import moment from 'moment';
import PageLayout from '@/layouts/PageLayout';
import styles from './index.less';
import isFunction from 'lodash/isFunction';
import { mapLoadingAndEffect } from '@/utils';
import searchFormMap from './searchFormMap';
import ContractList from './ContractList';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const formItemLayout = {
  labelCol: { span: 5, offset: 0},
  wrapperCol: { span: 19 }
};
const textFormProps = {
  colon: false,
  ...formItemLayout
}
const getTagByStatus = (status, type) => {
  const statusColor = ['red', 'green'];
  const map = {
    chargeFlag: ['租金未支付', '租金已支付'],
    valid: ['合同已过期', '有效合同'],
    nflag: ['企业未入驻', '企业已入驻']
  }
  return <Tag color={statusColor[status]}>{map[type][status]}</Tag>;
}
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
class Contract extends PureComponent {
  state = {
    drawerVisible: false,
    areaId: '11',
    searchValues: {},
    currentData: {}
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
  resetFields() {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      searchValues: {}
    });
  }
  componentDidMount() {
    this.setState({
      initForm: true
    })
    this.getContractData();
    this.getFloorsByAreaData(this.state.areaId);
  }
  handleShowContractInfo = currentData => {
    this.handleDrawerShow(true);
    this.setState({
      currentData
    })
  }
  handleDrawerShow = flag => {
    this.setState({
      drawerVisible: !!flag
    })
  }
  handleAreaChange = areaId => {
    this.setState({ areaId });
    this.resetFields();
    this.getContractData({ areaId, current: 1 });
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
    this.resetFields();
    this.getContractData({current: 1});
  }
  handlePaginationChange = current => {
    const { searchValues } = this.state;
    const mergeSearchValues = { ...searchValues, current }
    this.setState({
      searchValues: mergeSearchValues
    })
    this.getContractData(mergeSearchValues)
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
  renderSearchForm = () =>{ 
    const { floors } = this.props;
    return (
      <Form layout='inline' className={styles.cardListForm} onSubmit={this.handleContractSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {this.renderSearchFormItem({
            fmin: floors.map(item=>({label: item.name, value: item.id}))
          })}
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type='primary' htmlType='submit' onClick={this.handleContractSearch}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleSearchReset}>
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
    const { drawerVisible, areaId, initForm, currentData } = this.state;
    const { data: { records, total, current, size: pageSize }, fetchContracting } = this.props;
    const paginationProps = {
      onChange: this.handlePaginationChange,
      total,
      current,
      size: 'small',
      showQuickJumper: true,
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
            本页共 <b>{records.length}</b> 份合同 (<b>{records.filter(item=>!item.valid).length}</b> 份已经过期),租金共 <b dangerouslySetInnerHTML={{__html: Charts.yuan(records.reduce((pre, cur)=>pre+cur.rent,0))}}></b>元 (已支付的租金共 <b dangerouslySetInnerHTML={{__html: Charts.yuan(records.filter(item=>item.chargeFlag).reduce((pre, cur)=>pre+cur.rent,0))}}></b>元)
          </span>
        } type='info' showIcon style={{marginBottom: 16}}/>
        <ContractList
          loading={fetchContracting}
          data={records}
          pagination={paginationProps}
          onShowInfo={this.handleShowContractInfo}
        />
        <Drawer
          placement='right'
          width={380}
          closable={false}
          onClose={() => this.handleDrawerShow(false)}
          visible={drawerVisible}
        >
          <Form className={styles.drawerTextForm}>
            <FormItem label='合同编号' {...textFormProps}><b>{currentData.code}</b></FormItem>
            <FormItem label='公司名称' {...textFormProps}>{currentData.companyName}</FormItem>
            <FormItem label='法人' {...textFormProps}>{currentData.renter}</FormItem>
            <FormItem label='联系电话' {...textFormProps}>{currentData.tel}</FormItem>
            <FormItem label='房间号' {...textFormProps}>{currentData.roomsName}</FormItem>
            <FormItem label='租金' {...textFormProps}><span style={{color: '#d48806'}} dangerouslySetInnerHTML={{__html: Charts.yuan(currentData.rent)}}></span></FormItem>
            <FormItem label='押金' {...textFormProps}><span style={{color: '#d48806'}} dangerouslySetInnerHTML={{__html: Charts.yuan(currentData.deposit)}}></span></FormItem>
            <FormItem label='合同期限' {...textFormProps}>{moment(currentData.startTime).format('YYYY-MM-DD')} 至 {moment(currentData.endTime).format('YYYY-MM-DD')}</FormItem>
            <FormItem label='备注' {...textFormProps}>{currentData.remark || '-'}</FormItem>
            <FormItem label='状态' {...textFormProps}>
              {getTagByStatus(currentData.valid, 'valid')}
              {getTagByStatus(currentData.chargeFlag, 'chargeFlag')}
              {getTagByStatus(currentData.nflag, 'nflag')}
            </FormItem>
          </Form>
        </Drawer>
      </PageLayout>
    )
  }
}

export default Contract;
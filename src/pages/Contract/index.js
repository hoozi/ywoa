import React, { PureComponent, Fragment } from 'react';
import { 
  Button, 
  Row, 
  Col, 
  Drawer, 
  Radio, 
  Form, 
  Input,
  Icon,
  Select,
  Alert,
  Tag,
  Modal,
  InputNumber,
  DatePicker,
  Switch
} from 'antd';
import { connect } from 'react-redux';
import {  Charts } from 'ant-design-pro';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
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
    valid: ['合同已到期', '有效合同'],
    nflag: ['企业未入驻', '企业已入驻']
  }
  return <Tag color={statusColor[status]}>{map[type][status]}</Tag>;
}
const CreateModal = Form.create()(props => {
  const { form, handleSave, currentData, handleModalVisible, modalVisible } = props;
  const getFieldDecorator = form.getFieldDecorator;
  const handleOk = () => {
    form.validateFields((err, values) => {
      if(err) return;
      handleSave && handleSave(values)
    })
  }
  console.log(!!currentData.valid,!!currentData.chargeFlag,!!currentData.nflag)
  return (
    <Modal
      title={isEmpty(currentData) ? '新增合同' : '管理合同'}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      onOk={handleOk}
      destroyOnClose
    >
      <Form className={styles.modalForm}>
        <FormItem label='公司名称' {...formItemLayout}>
          {
            getFieldDecorator('companyName', {
              rules: [
                {
                  required: true,
                  message: '请输入公司名称！'
                }
              ],
              initialValue: currentData.companyName
            })(
              <Input placeholder='请输入'/>
            )
          }
        </FormItem>
        <FormItem label='法人' {...formItemLayout}>
          {
            getFieldDecorator('renter', {
              rules: [
                {
                  required: true,
                  message: '请输入法人！'
                }
              ],
              initialValue: currentData.renter
            })(
              <Input placeholder='请输入'/>
            )
          }
        </FormItem>
        <FormItem label='联系电话' {...formItemLayout}>
          {
            getFieldDecorator('tel', {
              rules: [
                {
                  required: true,
                  message: '请输入联系电话！'
                }
              ],
              initialValue: currentData.tel
            })(
              <Input placeholder='请输入'/>
            )
          }
        </FormItem>
        <FormItem label='房间号' {...formItemLayout}>
          
        </FormItem>
        <FormItem label='租金' {...formItemLayout}>
          {
            getFieldDecorator('rent', {
              rules: [
                {
                  required: true,
                  message: '请输入租金！'
                }
              ],
              initialValue: currentData.rent
            })(
              <InputNumber placeholder='请输入' style={{width: '100%'}}/>
            )
          }
        </FormItem>
        <FormItem label='押金' {...formItemLayout}>
          {
            getFieldDecorator('deposit', {
              rules: [
                {
                  required: true,
                  message: '请输入押金！'
                }
              ],
              initialValue: currentData.deposit
            })(
              <InputNumber placeholder='请输入' style={{width: '100%'}}/>
            )
          }
        </FormItem>
        <FormItem label='合同期限' {...formItemLayout}>
          {
            getFieldDecorator('rangeData', {
              rules: [
                {
                  required: true,
                  message: '请选择合同期限'
                }
              ],
              initialValue: isEmpty(currentData) ? [] : [moment(currentData.startTime), moment(currentData.endTime)]
            })(
              <RangePicker placeholder={['开始日期', '结束日期']} style={{width: '100%'}}/>
            )
          }
        </FormItem>
        <FormItem label='备注' {...formItemLayout}>
          {
            getFieldDecorator('remark')(
              <Input.TextArea placeholder='请输入' rows={4}/>
            )
          }
        </FormItem>
        <FormItem label='状态' {...formItemLayout} className={styles.itemSmall}>
          {
            getFieldDecorator('valid')(
              <Switch checkedChildren='合同有效' unCheckedChildren='合同无效' defaultChecked={!!currentData.valid} />
            )
          }
          {
            getFieldDecorator('chargeFlag')(
              <Switch checkedChildren='租金已支付' unCheckedChildren='租金未支付' defaultChecked={!!currentData.chargeFlag} style={{marginLeft: 8}}/>
            )
          }
          {
            getFieldDecorator('nflag')(
              <Switch checkedChildren='企业已入驻' unCheckedChildren='企业未入驻' defaultChecked={!!currentData.nflag} style={{marginLeft: 8}}/>
            )
          }
        </FormItem>
      </Form>
    </Modal>
  )
})
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
});
@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
class Contract extends PureComponent {
  state = {
    drawerVisible: false,
    areaId: '11',
    modalVisible: false,
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
  handleModalVisible = (flag, cur) => {
    this.setState({
      modalVisible: !!flag,
      currentData: isNil(cur) ? {} : cur
    })
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
    const { drawerVisible, areaId, currentData, modalVisible } = this.state;
    const { data: { records, total, current, size: pageSize }, fetchContracting } = this.props;
    const paginationProps = {
      onChange: this.handlePaginationChange,
      total,
      current,
      size: 'small',
      showQuickJumper: true,
      pageSize: pageSize+1
    }
    const parentMethods = {
      handleSave: this.handleSave,
      handleModalVisible: this.handleModalVisible
    }
    const getFormItemByAreaId = currentData => {
      const areaMap = ['仓库', '写字楼'];
      const fieldMap = {
        'roomsName': <FormItem label='房间号' {...textFormProps}>{currentData.roomsName}</FormItem>,
        'size': <FormItem label='总面积' {...textFormProps}>{currentData.roomsSize}㎡</FormItem>,
        'position': <FormItem label='位置' {...textFormProps}>{currentData.position}</FormItem>,
        'roomNum': <FormItem label='租房数量' {...textFormProps}>{currentData.roomNum}间</FormItem>
      }
      const formItemMap = {
        '11': <Fragment>
                {fieldMap['roomsName']}
                {fieldMap['roomNum']}
              </Fragment>,
        '13': <Fragment>
                {fieldMap['roomsName']}
                {fieldMap['roomNum']}
              </Fragment>,
        '10': <Fragment>
                {fieldMap['roomsName']}
                {fieldMap['roomNum']}
                {fieldMap['size']}
              </Fragment>,
        '12': <Fragment>
                {fieldMap['position']}
                {fieldMap['roomNum']}
                <FormItem label='所属区块' {...textFormProps}>{areaMap[currentData.contractType]}</FormItem>
                {fieldMap['size']}
              </Fragment>,
        '14': <Fragment>
                {fieldMap['position']}
                {fieldMap['roomNum']}
                {fieldMap['size']}
              </Fragment>
      }
      return formItemMap[areaId];
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
          <div>
            <span style={{paddingRight: 16}}>本页总计 <b>{records.length}</b> 份合同 (<b>{records.filter(item=>!item.valid).length}</b> 份已经过期)</span><span>租金总计 <b dangerouslySetInnerHTML={{__html: Charts.yuan(records.reduce((pre, cur)=>pre+cur.rent,0))}}></b>元 (已支付的租金共 <b dangerouslySetInnerHTML={{__html: Charts.yuan(records.filter(item=>item.chargeFlag).reduce((pre, cur)=>pre+cur.rent,0))}}></b>元)</span>
          </div>
        } type='info' showIcon style={{marginBottom: 16}}/>
        <ContractList
          loading={fetchContracting}
          data={records}
          pagination={paginationProps}
          onShowInfo={this.handleShowContractInfo}
          onAddData={() => this.handleModalVisible(true)}
          onEdit={(current) => this.handleModalVisible(true, current)}
        />
        <Drawer
          title='合同信息'
          placement='right'
          width={380}
          closable={false}
          onClose={() => this.handleDrawerShow(false)}
          visible={drawerVisible}
        >
          <Form className={styles.drawerTextForm}>
            <FormItem label='合同编号' {...textFormProps}>{currentData.code}</FormItem>
            <FormItem label='公司名称' {...textFormProps}>{currentData.companyName}</FormItem>
            <FormItem label='法人' {...textFormProps}>{currentData.renter}</FormItem>
            <FormItem label='联系电话' {...textFormProps}>{currentData.tel}</FormItem>
            {getFormItemByAreaId(currentData)}
            <FormItem label='租金' {...textFormProps}><span style={{color: '#d48806'}} dangerouslySetInnerHTML={{__html: Charts.yuan(currentData.rent)}}></span></FormItem>
            <FormItem label='押金' {...textFormProps}><span style={{color: '#d48806'}} dangerouslySetInnerHTML={{__html: Charts.yuan(currentData.deposit)}}></span></FormItem>
            <FormItem label='合同期限' {...textFormProps}>{moment(currentData.startTime).format('YYYY-MM-DD')} 至 {moment(currentData.endTime).format('YYYY-MM-DD')}</FormItem>
            <FormItem label='备注' {...textFormProps}>{currentData.remark || '-'}</FormItem>
            <FormItem label='状态' {...textFormProps}>
              {getTagByStatus(currentData.valid, 'valid')}
              {getTagByStatus(currentData.chargeFlag, 'chargeFlag')}
            </FormItem>
          </Form>
          <div className={styles.bottomButtons}>
            <Button type='primary' style={{ marginRight: 8 }}>
              <Icon type='edit'/> 管理
            </Button>
            <Button type='danger'>
              <Icon type='delete'/> 退租
            </Button>
          </div>
        </Drawer>
        <CreateModal
          {...parentMethods}
          currentData={currentData}
          modalVisible={modalVisible}
        />
      </PageLayout>
    )
  }
}

export default Contract;
import React, { Component } from 'react';
import styles from './Login.less';
import { Row, Col, Input, Form, Button, Alert } from 'antd';
import LoginChecker from '@/hoc/LoginChecker';
import inputMap from './map';
import { connect } from 'react-redux';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const loginStatusMap = {
  'error': '账号或密码错误',
  'success': '登录成功'
};

const mapStateToProps = ( { loading, user } ) => ({ 
  submitting:  loading.effects.user.login,
  loginStatus: user.get('loginStatus')
});
const mapDispatchToProps = ({ user }) => ({
  login: params => user.login(params)
});

@connect(mapStateToProps, mapDispatchToProps)
@Form.create()
class LoginPage extends Component {
  state = {
    randomStr: Date.now()
  }
  componentDidMount() {
    this.props.form.validateFields();
  }
  handleSubmit = e => {
    e.preventDefault();
    const { form, login } = this.props;
    form.validateFields((err, values) => {
      if(err) return;
      login(values);
    });
  }
  handleChangeCode = () => {
    this.setState({
      randomStr: Date.now()
    });
  }
  renderFormItem() {
    const { form: { getFieldDecorator } } = this.props;
    return inputMap.map(item => {
      let formItem;
      if(item.name === 'code') {
        formItem = (
          <FormItem key={item.name}>
            <Row gutter={8}>
              <Col span={16}>{getFieldDecorator(item.name, { ...item.options })(<Input {...item.props}/>)}</Col>
              <Col span={8}>
                <img 
                  src={`/code?randomStr=${this.state.randomStr}`} 
                  className={styles.codeImg} 
                  onClick={this.handleChangeCode}
                  alt='验证码' 
                />
              </Col>
            </Row>
          </FormItem>
        )
      } else {
        formItem = <FormItem key={item.name}>{getFieldDecorator(item.name, { ...item.options })(<Input {...item.props}/>)}</FormItem>
      }
      return formItem;
    });
  }
  render() {
    const { form: {getFieldsError}, loginStatus, submitting } = this.props;
    return (
      <LoginChecker>
        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <h1>优质服务，追求卓越</h1>
            <p>Quality service, The pursuit of excellence</p>
          </div>
          {loginStatus && <Alert message={loginStatusMap[loginStatus]} type={loginStatus} showIcon className={styles.loginStatus} key={loginStatus}/>}
          <Form
            onSubmit={this.handleSubmit}
            className={styles.loginArea}
          >
            { this.renderFormItem() }
            <Button 
              htmlType='submit'
              type='primary' 
              size='large' 
              className={styles.widthFull}
              loading={submitting}
              disabled={hasErrors(getFieldsError())}
            >
              登 录
            </Button>
          </Form>
        </div>
      </LoginChecker>
    )
  }
}

export default LoginPage;
import React from 'react';
import {
  Icon
} from 'antd';

export default [
  {
    name: 'username',
    props: {
      size: 'large',
      placeholder: '用户名',
      prefix: <Icon type='user' theme='outlined' style={{ color: 'rgba(0,0,0,.25)' }}/>
    },
    options: {
      initialValue: '',
      rules: [
        { required: true, message: '请输入用户名' }
      ]
    }
  },
  {
    name: 'password',
    props: {
      size: 'large',
      placeholder: '密码',
      type: 'password',
      prefix: <Icon type='lock' theme='outlined' style={{ color: 'rgba(0,0,0,.25)' }}/>
    },
    options: {
      initialValue: '',
      rules: [
        { required: true, message: '请输入密码' }
      ]
    }
  }/* ,
  {
    name: 'code',
    props: {
      size: 'large',
      placeholder: '验证码',
      prefix: <Icon type='safety-certificate' theme='outlined' style={{ color: 'rgba(0,0,0,.25)' }}/>
    },
    options: {
      rules: [
        { required: true, message: '请输入验证码' }
      ]
    }
  } */
]
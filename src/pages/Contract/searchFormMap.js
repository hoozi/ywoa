export default [
  {
    name: 'code',
    label: '合同编号',
    props: {
      placeholder: '请输入'
    }
  },
  {
    name: 'companyName',
    label: '公司名称',
    props: {
      placeholder: '请输入'
    }
  },
  {
    name: 'renter',
    label: '法　　人',
    props: {
      placeholder: '请输入'
    }
  },
  {
    name: 'fmin',
    label: '楼　　层',
    type: 'select',
    props: {
      placeholder: '请选择'
    },
    options: data => data
  },
  {
    name: 'roomsId',
    label: '　房间号',
    props: {
      placeholder: '请输入'
    }
  },
  /* {
    name: 'nflag',
    label: '入驻状态',
    type: 'select',
    props: {
      placeholder: '请选择'
    },
    options: [
      {
        label: '已入驻',
        value: 1
      },
      {
        label: '未入驻',
        value: 0
      }
    ]
  },
  {
    name: 'isRelet',
    label: '续租状态',
    type: 'select',
    props: {
      placeholder: '请选择'
    },
    options: [
      {
        label: '已续租',
        value: 1
      },
      {
        label: '未续租',
        value: 0
      }
    ]
  }, */
  {
    name: 'valid',
    label: '合同状态',
    type: 'select',
    props: {
      placeholder: '请选择'
    },
    options: [
      {
        label: '未到期',
        value: 1
      },
      {
        label: '已到期',
        value: 0
      }
    ]
  },
  {
    name: 'chargeFlag',
    label: '租金状态',
    type: 'select',
    props: {
      placeholder: '请选择'
    },
    options: [
      {
        label: '已支付',
        value: 1
      },
      {
        label: '未支付',
        value: 0
      }
    ]
  },
  {
    name: 'rangeDate',
    label: '起止日期',
    type: 'rangePicker',
    props: {
      placeholder: ['开始日期', '结束日期'],
      style: {
        width: '100%'
      }
    }
  }
]
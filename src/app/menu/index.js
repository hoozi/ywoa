import { formatterMenus } from '@/utils';

const menuData = [
  {
    name: '统计图表',
    icon: 'pie-chart',
    path: 'dashboard',
    children: [
      {
        name: '统计',
        path: 'analysis',
      }
    ],
  },
  {
    name: '业务管理',
    icon: 'profile',
    path: 'business',
    children: [
      {
        name: '合同管理',
        path: 'contract'
      },
      {
        name: '报修管理',
        path: 'repair'
      }
    ]
  },
  {
    name: '基础数据',
    icon: 'database',
    path: 'base',
    children: [
      {
        name: '楼层管理',
        path: 'floor'
      },
      {
        name: '房间管理',
        path: 'room'
      }
    ]
  },
  {
    name: '水电管理',
    icon: 'table',
    path: 'energy',
    children: [
      {
        name: '水费管理',
        path: 'water',
        children: [
           {
             name:'写字楼',
             path: 'office'
           },
           {
             name: '仓库',
             path: 'warehouse'
           },
           {
             name: '二期',
             path: 'phaseII'
           }
        ]
      },
      {
        name: '电费管理',
        path: 'electricity',
        children: [
          {
            name:'写字楼',
            path: 'office'
          },
          {
            name: '仓库',
            path: 'warehouse'
          },
          {
            name: '二期',
            path: 'phase'
          }
       ]
      },
      {
        name: '水表设置',
        path: 'set-water',
      },
      {
        name: '电表设置',
        path: 'set-ele',
      },
      {
        name: '水电统计',
        path: 'statistical',
      }
    ]
  },
  {
    name: '费收管理',
    icon: 'pay-circle-o',
    path: 'cost',
    children: [
      {
        name: '费用预收',
        path: 'adv-pay'
      },
      /* {
        name: '费用结算',
        path: 'clearing'
      }, */
      /* {
        name: '扣款管理',
        path: 'charge'
      }, */
      /* {
        name: '参数设置',
        path: 'set'
      },
      {
        name: '数据发布',
        path: 'release'
      } */
    ]
  },
  {
    name: '系统设置',
    icon: 'setting',
    path: 'setting',
    children: [
      {
        name: '用户管理',
        path: 'user-manage'
      },
      {
        name: '权限管理',
        path: 'auth'
      },
      {
        name: '角色管理',
        path: 'role'
      }
    ]
  }
];

export default () => formatterMenus(menuData);
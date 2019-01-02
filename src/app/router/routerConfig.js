import React from 'react';
import Loadable from 'react-loadable';
import PageLoading from '@/components/PageLoading';
import Exception403 from '@/pages/Exception/403';
import Exception500 from '@/pages/Exception/500';

const LoadingComponent = (path) => {
  return Loadable({
    loader: () => import(`@/pages/${path}`),
    loading: () => <PageLoading/>
  });
}

// pages
const Login = LoadingComponent('User/Login');
const Analysis = LoadingComponent('Analysis');

const authorizedRoutes = [
  {
    path: '/dashboard/analysis',
    exact: true,
    authorities: '1',
    unauthorized: Exception403,
    component: Analysis
  },
  {
    path: '/403',
    component: Exception403
  },
  {
    path: '/500',
    component: Exception500
  }
]

const normalRoutes = [
  {
    path: '/',
    exact: true,
    redirect: '/dashboard/analysis'
  },
  {
    path: '/user/login',
    exact: true,
    component: Login
  }
];


const combineRoutes = [
  ...authorizedRoutes,
  ...normalRoutes
];

export {
  authorizedRoutes,
  normalRoutes,
  combineRoutes
}
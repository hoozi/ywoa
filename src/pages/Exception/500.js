import React from 'react';
import { Link } from 'react-router-dom';
import { Exception } from 'ant-design-pro';

const Exception500 = () => (
  <Exception
    type="500"
    backText="返回首页"
    linkElement={Link}
  />
);

export default Exception500;

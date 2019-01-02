import React, { Component } from 'react';
import isFunction from 'lodash/isFunction';

export default class GlobalData extends Component {
  state = {
    data: {
      
    }
  }
  componentDidMount() {
    
  }
  render() {
    const { children } = this.props;
    return isFunction(children) ? children(this.state.data) : children;
  }
}
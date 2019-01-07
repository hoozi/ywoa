import React, { Component } from 'react';
import {
  Cascader
} from 'antd';
import { connect } from 'react-redux';
import omit from 'lodash/omit';
import styles from './index.less';

const options = [{
  value: '11',
  label: '写字楼A',
  isLeaf: false,
}, {
  value: '13',
  label: '写字楼B',
  isLeaf: false,
}, {
  value: '10',
  label: '仓库',
  isLeaf: false
}];
const omitProps = (props, omits) => omit(props, omits);
const mapStateToProps = ({ base }) => (
  {
    ...base
  }
);
const mapDispatchToProps = ({ base }) => (
  {
    getFloorsByArea: (params, meta) => base.fetchFloorsByArea(params, meta)
  }
)

@connect(mapStateToProps, mapDispatchToProps)
class FloorCascader extends Component {
  state = {
    options
  }
  handleLoadData = selectedOptions => {
    const targetSelectedOptions = selectedOptions[0];
    targetSelectedOptions.loading = true;
    this.props.getFloorsByArea(targetSelectedOptions.value, floors => {
      targetSelectedOptions.loading = false;
      targetSelectedOptions.children = floors.map(item => ({
        value: item.id,
        label: `${item.name}层`
      }));
      this.forceUpdate();
    });
  }
  render() {
    const { options } = this.state;
    const { ...restProps } = this.props
    return (
      <Cascader
        className={styles.floorCascader}
        options={options}
        loadData={this.handleLoadData}
        size='small'
        {...omitProps(restProps, ['getFloorsByArea'])}
      />
    )
  }
}

export default FloorCascader;
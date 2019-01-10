import React, { Component } from 'react';
import {
  Cascader, Spin
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
    options,
    defaultValue: []
  }
  getOptionChildren = data => {
    return data.map(item => ({
      value: item.id,
      label: `${item.name}层`
    }));
  }
  componentDidMount() {
    const { options } = this.state
    const { getInitValue } = this.props
    this.props.getFloorsByArea(options[0].value, floors => {
      options[0].children = this.getOptionChildren(floors);
      getInitValue && getInitValue([options[0].value, options[0].children[0].value]);
      this.forceUpdate();
    });
  }
  handleLoadData = selectedOptions => {
    const targetSelectedOptions = selectedOptions[0];
    targetSelectedOptions.loading = true;
    this.props.getFloorsByArea(targetSelectedOptions.value, floors => {
      targetSelectedOptions.loading = false;
      targetSelectedOptions.children = this.getOptionChildren(floors);
      this.forceUpdate();
    });
  }
  render() {
    const { options } = this.state;
    const { floors } = this.props;
    return (
      floors.length ? 
      <Cascader
        defaultValue={[options[0].value, floors[0].id]}
        className={styles.floorCascader}
        options={options}
        loadData={this.handleLoadData}
        allowClear={false}
        size='small'
        {...omitProps(this.props, ['getFloorsByArea','floors','getInitValue'])}
      /> : 
      <Spin/>
    )
  }
}

export default FloorCascader;
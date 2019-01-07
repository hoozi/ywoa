import React from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend
} from 'bizcharts';
import DataSet from '@antv/data-set';

export default ({data, height}) => {
  const ds = new DataSet();
  const dv = ds.createView().source(data);
  dv.transform({
    type: 'fold',
    fields: ['用电量', '用水量'],
    key: 'energyName',
    value: 'energyCount'
  });
  const cols = {
    month: {
      range: [0, 1]
    }
  };
  return (
    <Chart height={height} data={dv} scale={cols} forceFit>
      <Legend />
      <Axis name='month' />
      <Axis
        name='energyCount'
        label={{
          formatter: val => `${val}度`
        }}
      />
      <Tooltip
        crosshairs={{
          type: 'y'
        }}
      />
      <Geom
        type='line'
        position='month*energyCount'
        size={2}
        color={'energyName'}
        shape={'smooth'}
      />
      <Geom
        type='point'
        position='month*energyCount'
        size={4}
        shape={'circle'}
        color={'energyName'}
        style={{
          stroke: '#fff',
          lineWidth: 1
        }}
      />
    </Chart>
  )
}
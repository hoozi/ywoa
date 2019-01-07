import {
  queryPowerAnalysis,
  queryWaterAnalysis,
  queryContractCountAnalysis,
  queryAreaAnalysis,
  queryRentAnalysis
} from '@/api/analysis';
import isNil from 'lodash/isNil';
import values from 'lodash/values'

const fillEnergy = (type, data) => {
  return type.map((item, index) => {
    let tmp = 0;
    data.forEach(item => {
      if(item.month-1 === index) {
        tmp = item.totalDegree;
        return;
      }
    });
    return tmp
  })
  
}

const state = {
  power: [0,0,0,0,0,0,0,0,0,0,0,0],
  water: [0,0,0,0,0,0,0,0,0,0,0,0],
  contractCount: 0,
  area: [],
  rentOA: 0,
  rentOB: 0,
  rentOW: 0
};

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}
const effects = {
  async fetchWaterAnalysis(payload, { analysis }) {
    const response = await queryWaterAnalysis(payload);
    const { water } = analysis;
    if(isNil(response) || response.code !== 1000) return;
    const { data } = response;
    this.save({water: fillEnergy(water, data)})
  },
  async fetchPowerAnalysis(payload, { analysis }) {
    const response = await queryPowerAnalysis(payload);
    const { power } = analysis;
    if(isNil(response) || response.code !== 1000) return;
    const { data } = response;
    this.save({power: fillEnergy(power, data)})
  },
  async fetchContractCountAnalysis() {
    const response = await queryContractCountAnalysis();
    if(isNil(response) || response.code !== 1000) return;
    this.save({
      contractCount: response.data
    })
  },
  async fetchAreaAnalysis() {
    const response = await queryAreaAnalysis();
    if(isNil(response) || response.code !== 1000) return;
    this.save({
      area: values(response.data)
    })
  },
  async fetchRentAnalysis(payload) {
    const { code } = payload;
    const response = await queryRentAnalysis(payload);
    if(isNil(response) || response.code !== 1000) return;
    this.save({
      [`rent${code}`]: response.data
    })
  }
}

export default {
  state,
  reducers,
  effects
}
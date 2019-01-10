import {
  queryContract
} from '@/api/contract';
import isNil from 'lodash/isNil';

const state = {
  data: {
    records: [],
    current: 1,
    size: 14,
    total: 0
  }
};

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}
const effects = {
  async fetchContract(payload, { contract }) {
    const { data: {current, size} } = contract;
    const response = await queryContract({current, size, ...payload});
    if(isNil(response) || response.code !== 1000) return;
    this.save({
      data: response.data
    })
  }
}

export default {
  state,
  reducers,
  effects
}
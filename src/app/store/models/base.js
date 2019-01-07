import {
  queryFloorsByArea
} from '@/api/base';
import isNil from 'lodash/isNil';

const state = {
  floors: []
};

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}
const effects = {
  async fetchFloorsByArea(payload, rootState, callback) {
    const response = await queryFloorsByArea(payload);
    if(isNil(response) || response.code !== 1000) return;
    this.save({
      floors: response.data
    });
    callback && callback(response.data);
  }
}

export default {
  state,
  reducers,
  effects
}
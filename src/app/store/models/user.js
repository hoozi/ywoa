import { accountLogin } from '@/api/user';
import { push } from 'connected-react-router';
import { parse } from 'qs';
import _ from 'lodash';

const { map, flatten } = _;

//const router = getState().router;

const state = {
  currentUser: {},
  loginStatus: null
}
const reducers = {
  save(state, payload) {
    return {
      ...state,
      ...payload
    }
  }
};
const effects = dispatch => ({
  async login(payload, rootState) {
    const { router: {location: {search}} } = rootState;
    const response = await accountLogin(payload);
    const redirect = search ? parse(search.substring(1))['redirect'] : '/';
    if(response.code !== 1000) {
      return this.save({loginStatus: 'error'});
    }
    this.save({
      currentUser: response.data.username,
      loginStatus: 'success'
    });
    const permissions = map(flatten(map(response.data.roleList,'menuList')),'menuId')
    window.localStorage.setItem('permissions', permissions);
    dispatch(push(redirect));
  }
});

export default {
  state,
  reducers,
  effects
}
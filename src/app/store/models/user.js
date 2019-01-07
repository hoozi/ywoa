import { accountLogin, queryCurrentUser } from '@/api/user';
import { push } from 'connected-react-router';
import { parse } from 'qs';
import _ from 'lodash';
import { fromJS } from 'immutable';

const { map, flatten, uniq, isNil } = _;

//const router = getState().router;

const state = fromJS({
  currentUser: '',
  loginStatus: null
})
const reducers = {
  save(state, payload) {
    return state.merge(payload)
  }
};
const effects = dispatch => ({
  async login(payload, rootState) {
    const { router: {location: {search}} } = rootState;
    const response = await accountLogin(payload);
    const redirect = search ? parse(search.substring(1))['redirect'] : '/';
    if(isNil(response) || response.code !== 1000) {
      return this.save({loginStatus: 'error'});
    }
    this.save({
      loginStatus: 'success'
    });
    const permissions = uniq(map(flatten(map(response.data.roleList,'menuList')),'menuId'))
    window.localStorage.setItem('permissions', permissions);
    dispatch(push(redirect));
  },
  logout(payload, rootState) {
    const { router: {location: {pathname}} } = rootState;
    window.localStorage.removeItem('permissions');
    this.save({loginStatus: null});
    dispatch(push(`/user/login?redirect=${pathname}`));
  },
  async fetchCurrentUser() {
    const response = await queryCurrentUser();
    if(isNil(response) || response.code !== 1000) return;
    this.save({
      currentUser: response.data.username
    });
  }
});

export default {
  state,
  reducers,
  effects
}
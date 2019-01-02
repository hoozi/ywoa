import {stringify} from 'qs';
import request from '@/utils/request';

export async function accountLogin(params) {
  return request(`/api/user/login?${stringify(params)}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  });
}
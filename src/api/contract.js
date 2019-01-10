import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryContract(params) {
  return request(`/api/contract?${stringify(params)}`);
}
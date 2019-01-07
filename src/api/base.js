import {stringify} from 'qs';
import request from '@/utils/request';

export async function queryFloorsByArea(id) {
  return request(`/api/floor/list/${id}`);
}
import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryPowerAnalysis(params) {
  return request(`/api/stats/electric/all?${stringify(params)}`);
}
export async function queryWaterAnalysis(params) {
  return request(`/api/stats/water/all?${stringify(params)}`);
}
export async function queryContractCountAnalysis() {
  return request('/api/contract/count');
}
export async function queryAreaAnalysis() {
  return request('/api/room/stats');
}
export async function queryRentAnalysis(params) {
  return request(`/api/contract/rent?${stringify(params)}`)
}
export async function queryRoomAnalysis(params) {
  return request(`/api/room/info?${stringify(params)}`);
}
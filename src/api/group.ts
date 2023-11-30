import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';


export interface GroupRecord {
  id: string;
  groupName: string;
  groupId: string;
  type: 'group' | 'supergroup';
  createdTime: string;
}

export interface GroupParams extends Partial<GroupRecord> {
  current: number;
  pageSize: number;
}

export interface GroupListRes {
  records: GroupRecord[];
  total: number;
}

export function queryGroupList(params: GroupParams) {
  return axios.post<GroupListRes>('/group/list', params);
}
export function groupDict(){
  return axios.get<GroupRecord[]>('/group/dict');
}

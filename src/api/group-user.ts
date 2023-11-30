import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { GroupListRes } from "@/api/group";

export interface GroupUserRecord {
  id: string;
  groupId: string;
  userId: string;
  username: string;
  bot: boolean;
  ban: number;
  message: boolean;
  createdTime: string;
}

export interface GroupUserParams extends Partial<GroupUserRecord> {
  current: number;
  pageSize: number;
}

export interface GroupUserListRes {
  records: GroupUserRecord[];
  total: number;
}

export function queryGroupUserList(params: GroupUserParams) {
  return axios.post<GroupUserListRes>('/group/user/list', params);
}
export function banUser(id:number) {
  return axios.get(`/group/user/ban/${id}`);
}

export function unBanUser(id:number) {
  return axios.get(`/group/user/unban/${id}`);
}

export function noTalkUser(id:number) {
  return axios.get(`/group/user/noTalk/${id}`);
}

export function unTalkUser(id:number) {
  return axios.get(`/group/user/unTalk/${id}`);
}


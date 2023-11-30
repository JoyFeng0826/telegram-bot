import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import {HttpResponse} from "@/api/interceptor";

export interface KeyWordsRecord {
  id: number;
  botId: string;
  keyWord: string;
  status?: boolean|undefined;
  callTxt: string;
  createdTime: string;
  updateTime?: string;
}
export interface AddKeyWordsBody{

  botId: number| null;
  keyWord: string;
  callTxt: string;

}
export interface UpdateKeyWordsBody{
  id: number;
  keyWord: string;
  callTxt: string;

}

export interface KeyWordsParams extends Partial<KeyWordsRecord> {
  current: number;
  pageSize: number;
}

export interface KeyWordsListRes {
  records: KeyWordsRecord[];
  total: number;
}


export function queryKeyWordsList(params: KeyWordsParams) {
  return axios.post<KeyWordsListRes>('/keywords/list', params);
}

export function updateKeyWord(body: UpdateKeyWordsBody) {
  return axios.post('/keywords/update', body);
}


export function del(id: number) {
  return axios.get(`/keywords/del/${id}`);
}

export function addKeyWord(data: AddKeyWordsBody) {
  return axios.post(`/keywords/add`,data);
}
export function disable(id: number) {
  return axios.get(`/keywords/disable/${id}`);
}

export function enable(id: number) {
  return axios.get(`/keywords/enable/${id}`);
}
import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { HttpResponse } from '@/api/interceptor';

export interface FilterWordsRecord {
  id: number;
  word: string;
  type: number;
  status?: boolean | undefined;
  createdTime: string;
  updateTime?: string;
}
export interface AddFilterWordsBody {
  word: string;
  type: number;
}
export interface UpdateFilterWordsBody {
  id: number;
  word: string;

  type?:number;
}

export interface FilterWordsParams extends Partial<FilterWordsRecord> {
  current: number;
  pageSize: number;
}

export interface FilterWordsListRes {
  records: FilterWordsRecord[];
  total: number;
}

export function queryFilterWordsList(params: FilterWordsParams) {
  return axios.post<FilterWordsListRes>(
    '/telegram_prohibited_words/list',
    params
  );
}

export function updateFilterWord(body: UpdateFilterWordsBody) {
  return axios.post('/telegram_prohibited_words/update', body);
}

export function del(id: number) {
  return axios.get(`/telegram_prohibited_words/del/${id}`);
}

export function addFilterWord(data: AddFilterWordsBody) {
  return axios.post(`/telegram_prohibited_words/add`, data);
}
export function disable(id: number) {
  return axios.get(`/telegram_prohibited_words/disable/${id}`);
}

export function enable(id: number) {
  return axios.get(`/telegram_prohibited_words/enable/${id}`);
}

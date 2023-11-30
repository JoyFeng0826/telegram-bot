import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { HttpResponse } from '@/api/interceptor';

export interface TaskInfoRecord {
  id: number;
  botId: string;
  name: string;
  type: number;
  cron: string;
  txt?: string;
  url?: string;
  status?: boolean | undefined;
  chatIdsArray: number[];
  chatIds?: string;
  createdTime: string;
  updateTime?: string;
}
export interface AddTaskBody {
  botId: string;
  name: string;
  type: number;
  cron: string;
  txt?: string;
  url?: string;
  status?: boolean | undefined;
  chatIdsArray: string[];
}
export interface UpdateTaskBody {
  id: number;
  botId: string;
  name: string;
  type: number;
  cron: string;
  txt?: string;
  url?: string;
  chatIdsArray: string[];
}

export interface TaskParams extends Partial<TaskInfoRecord> {
  current: number;
  pageSize: number;
}

export interface TaskRes {
  records: TaskInfoRecord[];
  total: number;
}

export function queryTaskList(params: TaskParams) {
  return axios.post<TaskRes>(
    '/sys_task/list',
    params
  );
}

export function updateTask(body: UpdateTaskBody) {
  return axios.post('/sys_task/update', body);
}

export function del(id: number) {
  return axios.get(`/sys_task/del/${id}`);
}

export function addTask(data: AddTaskBody) {
  return axios.post(`/sys_task/add`, data);
}
export function disable(id: number) {
  return axios.get(`/sys_task/disable/${id}`);
}

export function enable(id: number) {
  return axios.get(`/sys_task/enable/${id}`);
}

export function exec(id: number) {
  return axios.get(`/sys_task/exec/${id}`);
}


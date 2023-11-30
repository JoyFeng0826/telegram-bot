import axios from "axios";
import qs from "query-string";
import type { DescData } from "@arco-design/web-vue/es/descriptions/interface";
import { HttpResponse } from "@/api/interceptor";

export interface BotInfoRecord {
  id: number;
  botName: string;
  botToken: string;
  status?: boolean | undefined;
  createdTime: string;
  updateTime?: string;
}

export interface AddBotInfo {

  botName: string;
  botToken: string;

}

export interface UpdateBot {
  id: number | null;
  botName: string;
  botToken: string;

}

export interface BotParams extends Partial<BotInfoRecord> {
  current: number;
  pageSize: number;
}

export interface BotListRes {
  records: BotInfoRecord[];
  total: number;
}


export function queryBotList(params: BotParams) {
  return axios.post<BotListRes>("/botInfo/list", params);
}

export function updateBotInfo(body: UpdateBot) {

  return axios.post("/botInfo/update", body);
}

export function isAdd() {
  return axios.get<boolean>("/botInfo/isAdd");
}

export function del(id: number) {
  return axios.delete<boolean>(`/botInfo/del/${id}`);
}

export function addBot(data: AddBotInfo) {
  return axios.post<boolean>(`/botInfo/add`, data);
}

export function botDict() {
  return axios.get(`/botInfo/dict`);
}
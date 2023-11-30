import axios from 'axios';
import { GroupRecord } from "@/api/group";

export interface MessageRecord {
  id: number;
  botId: number;
  type: string;
  messageId: string;
  groupId: number;
  userId: string;
  username: string;
  message: string;
  sendTime: string;
  createTime: string;
  updateTime: string;
}
export interface MessageRecordParams extends Partial<MessageRecord> {
  current: number;
  pageSize: number;
}

export interface MessageRecordListRes {
  records: MessageRecord[];
  total: number;
}


export function queryMessageRecordList(params: MessageRecordParams) {
  return axios.post<MessageRecordListRes>('/messagerecord/list',params);
}

export function delMessageRecordList(id:number) {
  return axios.get<MessageRecordListRes>(`/messagerecord/del/${id}`);
}



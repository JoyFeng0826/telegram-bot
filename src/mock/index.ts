import Mock from 'mockjs';

import './user';
import './message-box';

import '@/views/dashboard/workplace/mock';
import '@/views/bot/bot-info/mock';
import '@/views/group/group-manage/mock';
import '@/views/group/user-manage/mock';

Mock.setup({
  timeout: '600-1000',
});

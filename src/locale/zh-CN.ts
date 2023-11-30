import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeBoInfo from '@/views/bot/bot-info/locale/zh-CN';

import localeKeyWords from '@/views/bot/key-words/locale/zh-CN';
import localeGroup from '@/views/group/group-manage/locale/zh-CN';
import localeUser from '@/views/group/user-manage/locale/zh-CN';
import localMessage from '@/views/message/message-manage/locale/zh-CN';
import localFilterWords from '@/views/bot/filter-words/locale/zh-CN';
import localTask from '@/views/task/taskInfo/locale/zh-CN';
import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.task': '定时任务管理',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'menu.bot': '机器人管理',
  'menu.group': '群组管理',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localeBoInfo,
  ...localeKeyWords,
  ...localeGroup,
  ...localeUser,
  ...localMessage,
  ...localFilterWords,
  ...localTask,
};

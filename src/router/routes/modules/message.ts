import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Message: AppRouteRecordRaw = {
  path: '/message',
  name: 'message',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.message',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 4,
  },
  children: [
    {
      path: '/message/manage',
      name: 'manage',
      component: () => import('@/views/message/message-manage/index.vue'),
      meta: {
        locale: 'menu.message.messageManage',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default Message;

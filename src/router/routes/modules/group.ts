import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Group: AppRouteRecordRaw = {
  path: '/group',
  name: 'group',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.group',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 3,
  },
  children: [
    {
      path: 'groupManage',
      name: 'groupManage',
      component: () => import('@/views/group/group-manage/index.vue'),
      meta: {
        locale: 'menu.group.manage',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'userManage',
      name: 'userManage',
      component: () => import('@/views/group/user-manage/index.vue'),
      meta: {
        locale: 'menu.group.userManage',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default Group;

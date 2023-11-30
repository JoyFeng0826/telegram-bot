import { DEFAULT_LAYOUT, PAGE_LAYOUT } from "../base";
import { AppRouteRecordRaw } from '../types';

const TASK: AppRouteRecordRaw = {
  path: '/task',
  name: 'task',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.task',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 5,
  },
  children: [
    {
      path: 'taskInfo',
      name: 'taskInfo',
      component: () => import('@/views/task/taskInfo/index.vue'),
      meta: {
        locale: 'menu.task.taskInfo',
        requiresAuth: true,
        roles: ['*'],
      },
    },

  ],
};

export default TASK;

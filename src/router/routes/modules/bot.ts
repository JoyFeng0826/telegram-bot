import { DEFAULT_LAYOUT, PAGE_LAYOUT } from "../base";
import { AppRouteRecordRaw } from '../types';

const Bot: AppRouteRecordRaw = {
    path: '/bot',
    name: 'bot',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.bot',
        requiresAuth: true,
        icon: 'icon-dashboard',
        order: 1,
    },
    children: [
        {
            path: 'botInfo',
            name: 'botInfo',
            component: () => import('@/views/bot/bot-info/index.vue'),
            meta: {
                locale: 'menu.bot.botInfo',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'keyWords',
            name: 'keyWords',
            component: () => import('@/views/bot/key-words/index.vue'),
            meta: {
                locale: 'menu.bot.keyWords',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'filterWords',
            name: 'filterWords',
            component: () => import('@/views/bot/filter-words/index.vue'),
            meta: {
                locale: 'menu.bot.filterWords',
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ],
};

export default Bot;

import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
// @ts-ignore
import noVue3Cron from 'no-vue3-cron'
import 'no-vue3-cron/lib/noVue3Cron.css'
import router from './router';
import store from './store';
import i18n from './locale';
import directive from './directive';
import './mock';
import App from './App.vue';

// @ts-ignore
// Styles are imported via arco-plugin. See config/plugin/arcoStyleImport.ts in the directory for details
// 样式通过 arco-plugin 插件导入。详见目录文件 config/plugin/arcoStyleImport.ts
// https://arco.design/docs/designlab/use-theme-package
import '@/assets/style/global.less';
import '@/api/interceptor';

const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);
app.use(noVue3Cron)
app.use(router);
app.use(store);
app.use(i18n);
app.use(globalComponents);
app.use(directive);

app.mount('#app');

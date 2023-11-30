import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      fs: {
        strict: true,
      },
      proxy: {
        '/botInfo/': {
          target: 'http://localhost:8082',
          changeOrigin: true,
        },
        '/keywords/': {
          target: 'http://localhost:8082',
          changeOrigin: true,
        },
        '/group/': {
          target: 'http://localhost:8082',
          changeOrigin: true,
        },
        '/messagerecord/': {
          target: 'http://localhost:8082',
          changeOrigin: true,
        },
        '/user/': {
          target: 'http://localhost:8082',
          changeOrigin: true,
        },
        '/telegram_prohibited_words/': {
          target: 'http://localhost:8082',
          changeOrigin: true,
        },
        '/sys_task/': {
          target: 'http://localhost:8082',
          changeOrigin: true,
        },
      },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConfig
);

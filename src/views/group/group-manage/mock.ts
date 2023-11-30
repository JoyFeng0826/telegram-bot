import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

const { Random } = Mock;

const data = Mock.mock({
  'list|55': [
    {
      'id|8': /[A-Z][a-z][-][0-9]/,
      'groupId|4-8': /[A-Z]/,
      'groupName|8': /[A-Z][a-z][-][0-9]/,
      'type|1': ['group', 'supergroup'],
      'createTime': Random.datetime(),
    },
  ],
});

setupMock({
  mock: false,
  setup() {
    Mock.mock(new RegExp('/group/list'), (params: GetParams) => {
      const { current = 1, pageSize = 10 } = qs.parseUrl(params.url).query;
      const p = current as number;
      const ps = pageSize as number;
      return successResponseWrap({
        list: data.list.slice((p - 1) * ps, p * ps),
        total: 55,
      });
    });
  },
});

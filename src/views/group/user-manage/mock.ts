import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

const { Random } = Mock;

const data = Mock.mock({
  'list|55': [
    {
      'id|8': /[A-Z]/,
      'groupId|4-8': /[A-Z]/,
      'groupName|8': /[A-Z]/,
      'username|8': /[A-Z]/,
      'userId|8': /[A-Z]]/,
      'ban|1': [1, 2],
      'bot|1': [true, false],
      'message|1': [true, false],
      'createTime': Random.datetime(),
    },
  ],
});

setupMock({
  mock: false,
  setup() {
    Mock.mock(new RegExp('/api/list/user'), (params: GetParams) => {
      const { current = 1, pageSize = 10 } = qs.parseUrl(params.url).query;
      const p = current as number;
      const ps = pageSize as number;
      console.log(data)
      return successResponseWrap({
        list: data.list.slice((p - 1) * ps, p * ps),
        total: 55,
      });
    });
  },
});

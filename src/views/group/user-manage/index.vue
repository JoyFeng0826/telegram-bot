<template>
  <div class="container">
    <Breadcrumb :items="['menu.group', 'menu.group.userManage']" />
    <a-card class="general-card" :title="$t('menu.group.userManage')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="id"
                  :label="$t('searchTable.form.userId')"
                >
                  <a-input
                    v-model="formModel.id"
                    :placeholder="$t('searchTable.form.userId.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="groupId" :label="$t('searchTable.form.groupName')">
                  <a-select
                    v-model="formModel.groupId"
                    :placeholder="$t('searchTable.form.groupName.placeholder')"
                    :field-names="{value: 'id',label: 'groupName'}"
                    :options="dict"
                    :allow-clear="true"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="username" :label="$t('searchTable.form.username')">
                  <a-input
                    v-model="formModel.username"
                    :placeholder="$t('searchTable.form.username.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="createTimeRang"
                  :label="$t('searchTable.form.createTime')"
                >
                  <a-range-picker
                    v-model="formModel.createTimeRang"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="bot" :label="$t('searchTable.form.bot')">
                  <a-select
                    v-model="formModel.bot"
                    :placeholder="$t('searchTable.form.bot.placeholder')"
                    :options="botOptions"
                    :allow-clear="true"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="ban" :label="$t('searchTable.form.ban')">
                  <a-select
                    v-model="formModel.ban"
                    :placeholder="$t('searchTable.form.ban.placeholder')"
                    :options="banOptions"
                    :allow-clear="true"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="message" :label="$t('searchTable.form.message')">
                  <a-select
                    v-model="formModel.message"
                    :placeholder="$t('searchTable.form.message.placeholder')"
                    :options="messageOptions"
                    :allow-clear="true"
                  />
                </a-form-item>
              </a-col>

            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 140px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="75">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t("searchTable.form.search") }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t("searchTable.form.reset") }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button v-show="!renderData" type="primary">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t("searchTable.operation.create") }}
            </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"
            >
              <icon-refresh size="18"
              />
            </div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
              <div class="action-icon">
                <icon-line-height size="18" />
              </div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('searchTable.actions.columnSetting')">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon">
                <icon-settings size="18" />
              </div>
              <template #content>
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="
                          handleChange($event, item as TableColumnData, index)
                        "
                      >
                      </a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === "#" ? "序列号" : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="{
          wrapper: true,
          cell: true,
          headerCell: true,
          bodyCell: true,
        }"
        :size="size"
        @page-change="onPageChange"
      >
        <template #groupId="{ record }">
          {{ dict.length > 0 && (dict.find(e => e.id === record.groupId))?.groupName }}
        </template>
        <template #ban="{ record }">
          <span v-if="record.ban === 1" class="circle pass"></span>
          <span v-else class="circle warn"></span>
          {{ $t(`searchTable.form.ban.${record.ban}`) }}
        </template>
        <template #bot="{ record }">
          <span v-if="record.bot" class="circle pass"></span>
          <span v-else class="circle"></span>
          {{ $t(`searchTable.form.bot.${record.bot}`) }}
        </template>
        <template #message="{ record }">
          <span v-if="record.message" class="circle warn"></span>
          <span v-else class="circle pass"></span>
          {{ $t(`searchTable.form.message.${record.message}`) }}
        </template>
        <template #operations="{record}">
          <a-space v-show="!record.bot">
            <a-button v-show="record.ban === 1" v-permission="['admin']" shape="round" status="danger" size="small"
                     @click="banUserClick(record.id)"
            >
              <template #icon>
                <icon-close-circle />
              </template>
              {{ $t("groupUser.columns.operations.ban") }}
            </a-button>

            <a-button v-show="record.ban === 2" v-permission="['admin']" shape="round" status="success" size="small"
                       @click="unBanUserClick(record.id)">
              <template #icon>
                <icon-check-circle />
              </template>
              {{ $t("groupUser.columns.operations.unBan") }}
            </a-button>
            <a-button v-show="record.ban === 1 && !record.message" v-permission="['admin']" shape="round"
                      status="danger" size="small" @click="noTalkClick(record.id)">
              <template #icon>
                <icon-close-circle />
              </template>
              {{ $t("groupUser.columns.operations.message") }}
            </a-button>
            <a-button v-show="record.ban === 1 && record.message" v-permission="['admin']" tshape="round"
                      status="success" size="small"  @click="unTalkClick(record.id)">
              <template #icon>
                <icon-check-circle />
              </template>
              {{ $t("groupUser.columns.operations.unMessage") }}
            </a-button>
          </a-space>

        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import useLoading from "@/hooks/loading";
import {
  queryGroupUserList,
  GroupUserRecord,
  GroupUserParams,
  banUser,
  unBanUser,
  noTalkUser,
  unTalkUser
} from "@/api/group-user";
import { groupDict } from "@/api/group";
import { Pagination } from "@/types/global";
import type { SelectOptionData } from "@arco-design/web-vue/es/select/interface";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import cloneDeep from "lodash/cloneDeep";
import Sortable from "sortablejs";

type SizeProps = "mini" | "small" | "medium" | "large";
type Column = TableColumnData & { checked?: true };

const generateFormModel = () => {
  return {
    id: "",
    groupId: "",
    groupName: "",
    userId: "",
    username: "",
    bot: "",
    ban: "",
    message: "",
    createTimeRang: []
  };
};
const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
const renderData = ref<GroupUserRecord[]>([]);
const formModel = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

const size = ref<SizeProps>("medium");
const dict = ref<any[]>([]);
const opLoading = ref(false);
const tip = ref('');

const banUserClick = async (id: number) => {
    try{
      setLoading(true)
      await banUser(id);
      search()
    } finally {
      setLoading(false)
    }
};
const unBanUserClick = async (id: number) => {
  try{
    setLoading(true)
    await unBanUser(id);
    search()
  } finally {
    setLoading(false)
  }
};
const noTalkClick = async (id: number) => {
  try{
    setLoading(true)
    await noTalkUser(id);
    search()
  } finally {
    setLoading(false)
  }
};
const unTalkClick = async (id: number) => {
  try{
    setLoading(true)
    await unTalkUser(id);
    search()
  } finally {
    setLoading(false)
  }
};
const initDict = async () => {
  const { data } = await groupDict();
  dict.value = data;
};
onMounted(() => {
  initDict();
});
const basePagination: Pagination = {
  current: 1,
  pageSize: 20
};
const pagination = reactive({
  ...basePagination
});
const densityList = computed(() => [
  {
    name: t("searchTable.size.mini"),
    value: "mini"
  },
  {
    name: t("searchTable.size.small"),
    value: "small"
  },
  {
    name: t("searchTable.size.medium"),
    value: "medium"
  },
  {
    name: t("searchTable.size.large"),
    value: "large"
  }
]);
const columns = computed<TableColumnData[]>(() => [
  {
    title: t("groupUser.columns.id"),
    dataIndex: "id",
    align: "center"
  },
  {
    title: t("groupUser.columns.groupName"),
    dataIndex: "groupId",
    slotName: "groupId",
    align: "center"
  },
  {
    title: t("groupUser.columns.userId"),
    dataIndex: "userId",
    align: "center"
  },
  {
    title: t("groupUser.columns.username"),
    dataIndex: "username",
    align: "center"
  },
  {
    title: t("groupUser.columns.ban"),
    dataIndex: "ban",
    slotName: "ban",
    align: "center"
  },
  {
    title: t("groupUser.columns.bot"),
    dataIndex: "bot",
    slotName: "bot",
    align: "center"
  },
  {
    title: t("groupUser.columns.message"),
    dataIndex: "message",
    slotName: "message",
    align: "center"
  },
  {
    title: t("groupUser.columns.createTime"),
    dataIndex: "createTime",
    align: "center"
  },
  {
    title: t("groupUser.columns.operations"),
    dataIndex: "operations",
    slotName: "operations",
    align: "center"
  }
]);
const botOptions = computed<SelectOptionData[]>(() => [
  {
    label: t("searchTable.form.bot.false"),
    value: 0
  },
  {
    label: t("searchTable.form.bot.true"),
    value: 1
  }
]);
const banOptions = computed<SelectOptionData[]>(() => [
  {
    label: t("searchTable.form.ban.1"),
    value: 1
  },
  {
    label: t("searchTable.form.ban.2"),
    value: 2
  }
]);
const messageOptions = computed<SelectOptionData[]>(() => [
  {
    label: t("searchTable.form.message.false"),
    value: 0
  },
  {
    label: t("searchTable.form.message.true"),
    value: 1
  }
]);
const fetchData = async (
  params: GroupUserParams = { current: 1, pageSize: 20 }
) => {
  setLoading(true);
  try {
    const { data } = await queryGroupUserList(params);
    console.log(data);
    renderData.value = data.records;
    pagination.current = params.current;
    pagination.total = data.total;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const search = () => {
  fetchData({
    ...basePagination,
    ...formModel.value
  } as unknown as GroupUserParams);
};
const onPageChange = (current: number) => {
  fetchData({ ...basePagination, current });
};

fetchData();
const reset = () => {
  formModel.value = generateFormModel();
};

const handleSelectDensity = (
  val: string | number | Record<string, any> | undefined,
  e: Event
) => {
  size.value = val as SizeProps;
};

const handleChange = (
  checked: boolean | (string | boolean | number)[],
  column: Column,
  index: number
) => {
  if (!checked) {
    cloneColumns.value = showColumns.value.filter(
      (item) => item.dataIndex !== column.dataIndex
    );
  } else {
    cloneColumns.value.splice(index, 0, column);
  }
};

const exchangeArray = <T extends Array<any>>(
  array: T,
  beforeIdx: number,
  newIdx: number,
  isDeep = false
): T => {
  const newArray = isDeep ? cloneDeep(array) : array;
  if (beforeIdx > -1 && newIdx > -1) {
    // 先替换后面的，然后拿到替换的结果替换前面的
    newArray.splice(
      beforeIdx,
      1,
      newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
    );
  }
  return newArray;
};

const popupVisibleChange = (val: boolean) => {
  if (val) {
    nextTick(() => {
      const el = document.getElementById("tableSetting") as HTMLElement;
      const sortable = new Sortable(el, {
        onEnd(e: any) {
          const { oldIndex, newIndex } = e;
          exchangeArray(cloneColumns.value, oldIndex, newIndex);
          exchangeArray(showColumns.value, oldIndex, newIndex);
        }
      });
    });
  }
};

watch(
  () => columns.value,
  (val) => {
    cloneColumns.value = cloneDeep(val);
    cloneColumns.value.forEach((item, index) => {
      item.checked = true;
    });
    showColumns.value = cloneDeep(cloneColumns.value);
  },
  { deep: true, immediate: true }
);
</script>

<script lang="ts">
export default {
  name: "SearchTable"
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>

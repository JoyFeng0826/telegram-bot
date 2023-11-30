<template>
  <div class="container">
    <Breadcrumb :items="['menu.message', 'menu.message.messageManage']" />
    <a-card class="general-card" :title="$t('menu.message.messageManage')">
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
                  field="botId"
                  :label="$t('searchTable.form.botName')"
                >
                  <a-select
                    v-model="formModel.botId"
                    :placeholder="$t('searchTable.form.botName.placeholder')"
                    :field-names="{value: 'id',label: 'botName'}"
                    :options="botDictOptions"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="groupId"
                  :label="$t('searchTable.form.groupName')"
                >
                  <a-select
                    v-model="formModel.groupId"
                    :placeholder="$t('searchTable.form.groupId.placeholder')"
                    :field-names="{value: 'id',label: 'groupName'}"
                    :options="groupDictOptions"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="type"
                  :label="$t('message.form.type')"
                >
                  <a-select
                    v-model="formModel.type"
                    :placeholder="$t('message.form.type.placeholder')"
                    :options="typeOptions"
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
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
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
        :sticky-header="true"
        @page-change="onPageChange"
      >
        <template #groupId="{record}">

          {{ groupDictOptions.find(e => e.id === record.groupId)?.groupName }}
        </template>
        <template #type="{record}">
          {{ typeOptions.find(e => e.value === record.type)?.label }}
        </template>
        <template #operations="{record}">
          <a-popconfirm content="请再次确认是否删除？" type="error" @ok="delClick(record.id)">
          <a-button v-permission="['admin']" shape="round" status="danger" size="small" >
            {{ $t("botInfo.columns.operations.del") }}
          </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import useLoading from "@/hooks/loading";
import { MessageRecord, MessageRecordParams, queryMessageRecordList,delMessageRecordList } from "@/api/message";
import { botDict } from "@/api/bot-info";
import { groupDict } from "@/api/group";
import { Pagination } from "@/types/global";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import cloneDeep from "lodash/cloneDeep";
import Sortable from "sortablejs";

type SizeProps = "mini" | "small" | "medium" | "large";
type Column = TableColumnData & { checked?: true };

const generateFormModel = () => {
  return {
    botId: "",
    groupId: "",
    username: "",
    type: "",
    createTimeRang: []
  };
};
const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
const renderData = ref<MessageRecord[]>([]);
const formModel = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const botDictOptions = ref<any[]>([]);
const groupDictOptions = ref<any[]>([]);
const initBotDict = async () => {
  const { data } = await botDict();
  botDictOptions.value = data;
};
const initGroupDict = async () => {
  const { data } = await groupDict();
  groupDictOptions.value = data;
};
onMounted(() => {
  initGroupDict();
  initBotDict();
});
const delClick = async (id: number) => {
    try{
      setLoading(true);
      await delMessageRecordList(id);
      search()
    }finally {
      setLoading(false);
    }
};

const typeOptions = computed(() => [
  {
    label: t("message.form.type.txt"),
    value: "txt"
  },
  {
    label: t("message.form.type.photo"),
    value: "photo"
  },
  {
    label: t("message.form.type.video"),
    value: "video"
  },
  {
    label: t("message.form.type.voice"),
    value: "voice"
  }
]);
const size = ref<SizeProps>("medium");

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
    title: t("message.columns.id"),
    dataIndex: "id",
    align: "center"
  },
  {
    title: t("message.columns.groupName"),
    dataIndex: "groupId",
    slotName: "groupId",
    align: "center"
  },
  {
    title: t("message.columns.userId"),
    dataIndex: "userId",
    align: "center"
  },
  {
    title: t("message.columns.username"),
    dataIndex: "username",
    align: "center"
  },
  {
    title: t("message.columns.message"),
    dataIndex: "message",
    align: "center"
  },
  {
    title: t("message.columns.type"),
    dataIndex: "type",
    slotName: "type",
    align: "center"
  },
  {
    title: t("botInfo.columns.createTime"),
    dataIndex: "createTime",
    align: "center"
  },
  {
    title: t("botInfo.columns.operations"),
    dataIndex: "operations",
    slotName: "operations",
    align: "center"
  }
]);
const fetchData = async (
  params: MessageRecordParams = { current: 1, pageSize: 20 }
) => {
  setLoading(true);
  try {
    const { data } = await queryMessageRecordList(params);
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
  } as unknown as MessageRecordParams);
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

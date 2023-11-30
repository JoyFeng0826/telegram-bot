<template>
  <div class="container">
    <Breadcrumb :items="['menu.bot', 'menu.bot.botInfo']" />
    <a-card class="general-card" :title="$t('menu.bot.botInfo')">
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
                <a-form-item field="id" :label="$t('searchTable.form.id')">
                  <a-input
                    v-model="formModel.id"
                    :placeholder="$t('searchTable.form.id.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="botName"
                  :label="$t('searchTable.form.botName')"
                >
                  <a-input
                    v-model="formModel.botName"
                    :placeholder="$t('searchTable.form.botName.placeholder')"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item
                  field="createTime"
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
            <a-button type="primary" @click="showAddBot">
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
            <div class="action-icon" @click="search">
              <icon-refresh size="18" />
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
        <template #operations="{record}">
          <a-button v-permission="['admin']" type="text" size="small" @click="showUpdateBot(record)">
            {{ $t("botInfo.columns.operations.edit") }}
          </a-button>
          <a-popconfirm content="请再次确认是否删除？" type="error" @ok="comDel(record.id)">
            <a-button v-permission="['admin']" type="text" size="small">
              {{ $t("botInfo.columns.operations.del") }}
            </a-button>
          </a-popconfirm>

        </template>
      </a-table>
    </a-card>
    <a-modal v-if="addVisible" v-model:visible="addVisible" title-align="start"
             :mask-closable="false" :footer="false">
      <template #title>
        新增机器人
      </template>
      <a-form ref="addFromRef" :model="addForm" @submit="handleSubmit">
        <a-form-item field="botName" label="名称"
                     :rules="[{required:true,message:'必填'},{minLength:5,message:'至少5个字符'}]">
          <a-input
            v-model="addForm.botName"
            placeholder="请输入机器人名称"

          />
        </a-form-item>
        <a-form-item field="botToken" label="Token"
                     :rules="[{required:true,message:'必填'}]">
          <a-textarea v-model="addForm.botToken" placeholder="请输入机器人Token" />
        </a-form-item>
        <div style="text-align: right;">
          <a-button style="margin-right:20px " @click="handleAddCancel">取消</a-button>
          <a-button type="primary" :loading="saving" html-type="submit">保存</a-button>
        </div>
      </a-form>
    </a-modal>

    <a-modal v-if="updateVisible" v-model:visible="updateVisible" title-align="start"
             :mask-closable="false" :footer="false">
      <template #title>
        编辑机器人
      </template>
      <a-form :model="updateForm" @submit="handleUpdateSubmit">
        <a-form-item field="botName" label="名称"
                     :rules="[{required:true,message:'必填'},{minLength:5,message:'至少5个字符'}]">
          <a-input
            v-model="updateForm.botName"
            placeholder="请输入机器人名称"
          />
        </a-form-item>
        <a-form-item field="botToken" label="Token"
                     :rules="[{required:true,message:'必填'}]">
          <a-textarea :disabled="true" v-model="updateForm.botToken" placeholder="请输入机器人Token" />
        </a-form-item>
        <div style="text-align: right;">
          <a-button style="margin-right:20px " @click="handleUpdateCancel">取消</a-button>
          <a-button type="primary" :loading="saving" html-type="submit">保存</a-button>
        </div>
      </a-form>
    </a-modal>
  </div>

</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import useLoading from "@/hooks/loading";
import {
  BotInfoRecord,
  BotParams,
  queryBotList,
  updateBotInfo,
  del,
  isAdd, AddBotInfo, addBot, UpdateBot
} from "@/api/bot-info";
import { Pagination } from "@/types/global";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import cloneDeep from "lodash/cloneDeep";
import Sortable from "sortablejs";

type SizeProps = "mini" | "small" | "medium" | "large";
type Column = TableColumnData & { checked?: true };

const generateFormModel = () => {
  return {
    id: null,
    botName: null,
    createTimeRang: []
  };
};
const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
const renderData = ref<BotInfoRecord[]>([]);
const formModel = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const add = ref<boolean>(false);
const addVisible = ref<boolean>(false);
const updateVisible = ref<boolean>(false);
const addForm = reactive<AddBotInfo>({
  botName: "",
  botToken: ""
});
const updateForm = reactive<UpdateBot>({
  id: null,
  botName: "",
  botToken: ""
});
const saving = ref<boolean>(false);
const showAddBot = () => {

  addVisible.value = true;
};

const showUpdateBot = (record: BotInfoRecord) => {
  console.log(record);
  updateForm.botName = record.botName;
  updateForm.botToken = record.botToken;
  updateForm.id = record.id;
  updateVisible.value = true;
};
const handleUpdateCancel = () => {
  updateVisible.value = false;
  saving.value = false;
};
const handleAddCancel = () => {
  addVisible.value = false;
  addForm.botName = "";
  addForm.botToken = "";
  saving.value = false;
};

const handleUpdateSubmit = async ({ values, errors }: any) => {

  console.log("values:", values, "\nerrors:", errors);
  if (!errors) {
    saving.value = true;
    try {
      await updateBotInfo(values);
      updateVisible.value = false;
      saving.value = false;
      search();
    } catch (e) {
      saving.value = false;
    }
  }
};

const handleSubmit = async ({ values, errors }: any) => {

  console.log("values:", values, "\nerrors:", errors);
  if (!errors) {
    saving.value = true;
    try {
      const { data } = await addBot(values);
      if (data) {
        addVisible.value = false;
        saving.value = false;
        addForm.botName = "";
        addForm.botToken = "";
        search();
      }
    } catch (e) {
      saving.value = false;
    }


  }
};
const comDel = async (id: number) => {
  const { data } = await del(id);
  if (data) {
    search();
    await addData();
  }

};
const addData = async () => {
  const { data } = await isAdd();
  add.value = data;
};
addData();
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
    title: t("botInfo.columns.id"),
    dataIndex: "id",
    align: "center",
    width: 100
  },
  {
    title: t("botInfo.columns.botName"),
    dataIndex: "botName",
    align: "center",
    width: 200
  },
  {
    title: t("botInfo.columns.botToken"),
    dataIndex: "botToken",
    align: "center",
    width: 450
  },
  {
    title: t("botInfo.columns.createTime"),
    dataIndex: "createTime",
    align: "center",
    width: 200
  },
  {
    title: t("botInfo.columns.operations"),
    dataIndex: "operations",
    slotName: "operations",
    align: "center"
  }
]);
const fetchData = async (
  params: BotParams = { current: 1, pageSize: 20 }
) => {
  setLoading(true);
  try {
    const { data } = await queryBotList(params);
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
  } as unknown as BotParams);
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

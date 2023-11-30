<template>
  <div class="container">
    <Breadcrumb :items="['menu.bot', 'menu.bot.keyWords']" />
    <a-card class="general-card" :title="$t('menu.bot.keyWords')">
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
                <a-form-item field="botId" :label="$t('keyWords.form.botName')"
                >
                  <a-select
                    v-model="formModel.botId"
                    :placeholder="$t('keyWords.form.botName.placeholder')"
                    :field-names="{value: 'id',label: 'botName'}"
                    :options="dict"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="keyWord" :label="$t('keyWords.form.keyWord')">
                  <a-input
                    v-model="formModel.keyWord"
                    :placeholder="$t('keyWords.form.keyWord.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('keyWords.form.status')">
                  <a-select

                    v-model="formModel.status"
                    :placeholder="$t('keyWords.form.status.placeholder')"
                    :options="statusOptions"
                    :allow-clear="true"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="createTimeRange"
                  :label="$t('searchTable.form.createTime')"
                >
                  <a-range-picker
                    v-model="formModel.createTimeRange"
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
            <a-button type="primary" @click="showAddKeyWord">
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
        <template #botId="{ record }">
          {{ dict.length > 0 && (dict.find(e => e.id === record.botId))?.botName }}
        </template>
        <template #status="{ record }">
          <span v-if="record.status" class="circle pass"></span>
          <span v-else class="circle warn"></span>
          {{ $t(`keyWords.form.status.${record.status}`) }}
        </template>
        <template #operations="{record}">
          <a-space>
            <a-button v-show="record.status" v-permission="['admin']" shape="round" size="small"
                      @click="showUpdateKeyword(record)">
              {{ $t("keyWords.columns.operations.edit") }}
            </a-button>
            <a-button v-show="!record.status" @click="keyWordDisable(record.id)" shape="round" status="success"
                      v-permission="['admin']" size="small">
              {{ $t("keyWords.columns.operations.disable") }}
            </a-button>
            <a-button v-show="record.status" @click="keyWordEnable(record.id)" v-permission="['admin']" shape="round"
                      status="danger" size="small">
              {{ $t("keyWords.columns.operations.enable") }}
            </a-button>
            <a-popconfirm content="请再次确认是否删除？" type="error" @ok="keyWordDel(record.id)">
              <a-button v-permission="['admin']" shape="round" status="danger" size="small">
                {{ $t("keyWords.columns.operations.del") }}
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>
    <a-modal v-if="addVisible" v-model:visible="addVisible" title-align="start"
             :mask-closable="false" :footer="false">
      <template #title>
        新增关键字
      </template>
      <a-form ref="addFromRef" :model="addForm" @submit="handleSubmit">
        <a-form-item field="botId" label="机器人名称"
                     :rules="[{required:true,message:'必填'}]">
          <a-select
            v-model="addForm.botId"
            :placeholder="$t('keyWords.form.botName.placeholder')"
            :field-names="{value: 'id',label: 'botName'}"
            :options="dict"
          >
          </a-select>
        </a-form-item>
        <a-form-item field="keyWord" label="关键字"
                     :rules="[{required:true,message:'必填'}]">
          <a-input v-model="addForm.keyWord" placeholder="请输入关键字" />
        </a-form-item>
        <a-form-item field="callTxt" label="返回消息"
                     :rules="[{required:true,message:'必填'}]">
          <a-textarea v-model="addForm.callTxt" placeholder="请输入回复消息" />
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
        编辑关键字
      </template>
      <a-form :model="updateForm" @submit="handleUpdateSubmit">


        <a-form-item field="keyWord" label="关键字"
                     :rules="[{required:true,message:'必填'}]">
          <a-input v-model="updateForm.keyWord" placeholder="请输入关键字" />
        </a-form-item>
        <a-form-item field="callTxt" label="返回消息"
                     :rules="[{required:true,message:'必填'}]">
          <a-textarea v-model="updateForm.callTxt" placeholder="请输入回复消息" />
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
import { computed, ref, reactive, watch, nextTick, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import useLoading from "@/hooks/loading";
import { Pagination } from "@/types/global";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import cloneDeep from "lodash/cloneDeep";
import Sortable from "sortablejs";
import { botDict } from "@/api/bot-info";
import {
  KeyWordsParams,
  KeyWordsRecord,
  queryKeyWordsList,
  del,
  disable,
  enable,
  AddKeyWordsBody, UpdateKeyWordsBody, updateKeyWord, addKeyWord
} from "@/api/key-words";

type SizeProps = "mini" | "small" | "medium" | "large";
type Column = TableColumnData & { checked?: true };

const generateFormModel = () => {
  return {
    id: null,
    botId: null,
    keyWord: null,
    status: null,
    createTimeRange: []
  };
};
const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
const renderData = ref<KeyWordsRecord[]>([]);
const formModel = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);

const dict = ref<any[]>([]);

const size = ref<SizeProps>("medium");
const addVisible = ref<boolean>(false);
const updateVisible = ref<boolean>(false);
const addForm = reactive<AddKeyWordsBody>({
  botId: null,
  keyWord: "",
  callTxt: ""
});
const updateForm = reactive<UpdateKeyWordsBody>({
  id: -1,
  keyWord: "",
  callTxt: ""
});
const saving = ref<boolean>(false);
const showAddKeyWord = () => {

  addVisible.value = true;
};

const showUpdateKeyword = (record: KeyWordsRecord) => {
  updateForm.keyWord = record.keyWord;
  updateForm.callTxt = record.callTxt;
  updateForm.id = record.id;
  updateVisible.value = true;
};
const handleUpdateCancel = () => {
  updateVisible.value = false;
  saving.value = false;
};
const handleAddCancel = () => {
  addVisible.value = false;
  saving.value = false;
  addForm.botId = null;
  addForm.keyWord = "";
  addForm.callTxt = "";
};

const handleUpdateSubmit = async ({ values, errors }: any) => {

  console.log("values:", values, "\nerrors:", errors);
  if (!errors) {
    saving.value = true;
    try {
      await updateKeyWord(values);
      saving.value = false;
      updateVisible.value = false;
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
      await addKeyWord(values);
      addVisible.value = false;
      saving.value = false;
      addForm.botId = null;
      addForm.keyWord = "";
      addForm.callTxt = "";
      search();
    } catch (e) {
      saving.value = false;
    }

  }
};

const keyWordDisable = async (id: number) => {
  await disable(id);
  search();
};
const keyWordEnable = async (id: number) => {
  await enable(id);
  search();
};
const keyWordDel = async (id: number) => {
  await del(id);
  search();
};


const basePagination: Pagination = {
  current: 1,
  pageSize: 20
};
const pagination = reactive({
  ...basePagination
});
const statusOptions = computed(() => [
  {
    label: t("keyWords.form.status.false"),
    value: 0
  },
  {
    label: t("keyWords.form.status.true"),
    value: 1
  }
]);
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
    title: t("keyWords.columns.id"),
    dataIndex: "id",
    align: "center"
  },
  {
    title: t("keyWords.columns.botId"),
    dataIndex: "botId",
    slotName: "botId",
    align: "center"
  },
  {
    title: t("keyWords.columns.keyWord"),
    dataIndex: "keyWord",
    align: "center"
  },
  {
    title: t("keyWords.columns.callTxt"),
    dataIndex: "callTxt",
    align: "center"
  },
  {
    title: t("keyWords.columns.status"),
    dataIndex: "status",
    slotName: "status",
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
  params: KeyWordsParams = { current: 1, pageSize: 20 }
) => {
  setLoading(true);
  try {
    const { data } = await queryKeyWordsList(params);
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
  } as unknown as KeyWordsParams);
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
const initDict = async () => {
  const { data } = await botDict();
  dict.value = data;
};
onMounted(() => {
  initDict();
});
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

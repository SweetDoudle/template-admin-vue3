<template>
  <div class="card filter">
    <h4 v-if="title" class="title sle">
      {{ title }}
    </h4>
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
    <el-scrollbar
      :style="{ height: title ? `calc(100% - 95px)` : `calc(100% - 56px)` }"
    >
      <el-tree
        ref="treeRef"
        default-expand-all
        :node-key="id"
        :data="multiple ? treeData : treeAllData"
        :show-checkbox="multiple"
        :check-strictly="false"
        :current-node-key="!multiple ? selected : ''"
        :highlight-current="!multiple"
        :expand-on-click-node="false"
        :check-on-click-node="multiple"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :default-checked-keys="multiple ? selected : []"
        @node-click="handleNodeClick"
        @check="handleCheckChange"
      >
        <template #default="scope">
          <span class="el-tree-node__label">
            <slot :row="scope">
              {{ scope.node.label }}
            </slot>
          </span>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script setup name="TreeFilter">
import { ref, watch, onBeforeMount, nextTick } from "vue";
import { ElTree } from "element-plus";

// 接收父组件参数并设置默认值
const props = defineProps({
  // 请求分类数据的 api
  requestApi: {
    type: Function,
    default: () => {},
  },

  // 分类数据，如果有分类数据，则不会执行 api 请求
  data: {
    type: Array,
    default: () => [],
  },

  // treeFilter 标题
  title: {
    type: String,
    default: "",
  },

  // 选择的id
  id: {
    type: String,
    default: "id",
  },

  // 显示的label
  label: {
    type: String,
    default: "label",
  },

  // 是否为多选
  multiple: {
    type: Boolean,
    default: false,
  },

  // 默认选中的值
  defaultValue: {
    type: [String, Number, Array],
    default: "",
  },
});

const defaultProps = {
  children: "children",
  label: props.label,
};

const treeRef = ref();
const treeData = ref([]);
const treeAllData = ref([]);

const selected = ref();
const setSelected = () => {
  if (props.multiple)
    selected.value = Array.isArray(props.defaultValue)
      ? props.defaultValue
      : [props.defaultValue];
  else
    selected.value =
      typeof props.defaultValue === "string" ? props.defaultValue : "";
};

onBeforeMount(async () => {
  setSelected();
  if (props.requestApi) {
    const { data } = await props.requestApi();
    treeData.value = data;
    treeAllData.value = [{ id: "", [props.label]: "全部" }, ...data];
  }
});

// 使用 nextTick 防止打包后赋值不生效，开发环境是正常的
watch(
  () => props.defaultValue,
  () => nextTick(() => setSelected()),
  { deep: true, immediate: true }
);

watch(
  () => props.data,
  () => {
    if (props.data?.length) {
      treeData.value = props.data;
      treeAllData.value = [{ id: "", [props.label]: "全部" }, ...props.data];
    }
  },
  { deep: true, immediate: true }
);

const filterText = ref("");
watch(filterText, (val) => {
  treeRef.value.filter(val);
});

// 过滤
const filterNode = (value, data, node) => {
  if (!value) return true;
  let parentNode = node.parent,
    labels = [node.label],
    level = 1;
  while (level < node.level) {
    labels = [...labels, parentNode.label];
    parentNode = parentNode.parent;
    level++;
  }
  return labels.some((label) => label.indexOf(value) !== -1);
};

// emit
const emit = defineEmits(["change"]);

// 单选
const handleNodeClick = (data) => {
  if (props.multiple) return;
  emit("change", data[props.id]);
};

// 多选
const handleCheckChange = () => {
  emit("change", treeRef.value?.getCheckedKeys());
};

// 暴露给父组件使用
defineExpose({ treeData, treeAllData, treeRef });
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>

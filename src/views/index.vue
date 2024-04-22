<template>
  <div class="el-main">
    <div class="main-box">
      <TreeFilter
        label="name"
        title="部门列表(单选)"
        :request-api="deptTree"
        :default-value="initParam.departmentId"
        @change="changeTreeFilter"
      />
      <ProTable
        ref="proTable"
        :columns="columns"
        :request-api="getTableList"
        :init-param="initParam"
        :data-callback="dataCallback"
        @darg-sort="sortTable"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader="scope">
          <el-button
            type="primary"
            :icon="CirclePlus"
            @click="openDrawer('新增')"
            >新增用户</el-button
          >
          <el-button type="primary" :icon="Upload" plain @click="batchAdd"
            >批量添加用户</el-button
          >
          <el-button type="primary" :icon="Download" plain @click="downloadFile"
            >导出用户数据</el-button
          >
          <el-button type="primary" plain @click="toDetail"
            >To 子集详情页面</el-button
          >
          <el-button
            type="danger"
            :icon="Delete"
            plain
            :disabled="!scope.isSelected"
            @click="batchDelete(scope.selectedListIds)"
          >
            批量删除用户
          </el-button>
        </template>
        <!-- Expand -->
        <template #expand="scope">
          {{ scope.row }}
        </template>
        <!-- usernameHeader -->
        <template #usernameHeader="scope">
          <el-button
            type="primary"
            @click="ElMessage.success('我是通过作用域插槽渲染的表头')"
          >
            {{ scope.column.label }}
          </el-button>
        </template>
        <!-- createTime -->
        <template #createTime="scope">
          <el-button
            type="primary"
            link
            @click="ElMessage.success('我是通过作用域插槽渲染的内容')"
          >
            {{ scope.row.createTime }}
          </el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button
            type="primary"
            link
            :icon="View"
            @click="openDrawer('查看', scope.row)"
            >查看</el-button
          >
          <el-button
            type="primary"
            link
            :icon="EditPen"
            @click="openDrawer('编辑', scope.row)"
            >编辑</el-button
          >
          <el-button
            type="primary"
            link
            :icon="Refresh"
            @click="resetPass(scope.row)"
            >重置密码</el-button
          >
          <el-button
            type="primary"
            link
            :icon="Delete"
            @click="deleteAccount(scope.row)"
            >删除</el-button
          >
        </template>
      </ProTable>
    </div>
  </div>
</template>

<script setup lang="jsx" name="useProTable">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import TreeFilter from "@/components/TreeFilter/index.vue";
import {
  CirclePlus,
  Delete,
  EditPen,
  Download,
  Upload,
  View,
  Refresh,
} from "@element-plus/icons-vue";
import { getUserList, deptTree } from "@/api/modules/user";

const router = useRouter();

// 跳转详情页
const toDetail = () => {
  router.push(
    `/proTable/useProTable/detail/${Math.random().toFixed(
      3
    )}?params=detail-page`
  );
};

// ProTable 实例
const proTable = ref();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1, departmentId: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize,
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getUserList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 自定义渲染表头（使用tsx语法）
const headerRender = (scope) => {
  return (
    <el-button
      type="primary"
      onClick={() => ElMessage.success("我是通过 tsx 语法渲染的表头")}
    >
      {scope.column.label}
    </el-button>
  );
};

// 表格配置项
const columns = reactive([
  { type: "selection", fixed: "left", width: 70 },
  { type: "sort", label: "Sort", width: 80 },
  { type: "expand", label: "Expand", width: 85 },
  {
    prop: "userId",
    label: "用户id",
    search: { el: "input", tooltip: "我是搜索提示" },
    width: 85,
  },
  {
    prop: "recycleTime",
    label: "用户id",
    search: { el: "input", tooltip: "我是搜索提示" },
    width: 85,
  },
  {
    prop: "questionNum",
    label: "用户id",
    search: { el: "input", tooltip: "我是搜索提示" },
    width: 85,
  },
  {
    prop: "packId",
    label: "用户id",
    search: { el: "input", tooltip: "我是搜索提示" },
    width: 85,
  },
  {
    prop: "getTime",
    label: "用户id",
    search: { el: "input", tooltip: "我是搜索提示" },
    width: 85,
  },
  {
    prop: "batchName",
    label: "用户姓名",
    width: "atuo",
    search: { el: "input", tooltip: "我是搜索提示" },
    render: (scope) => {
      return (
        <el-button
          type="primary"
          link
          onClick={() => ElMessage.success("我是通过 tsx 语法渲染的内容")}
        >
          {scope.row.batchName}
        </el-button>
      );
    },
  },
  {
    prop: "packName",
    label: "性别",
    // 字典数据（本地数据）
    // enum: genderType,
    // 字典请求不带参数
    enum: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              { genderLabel: "男", genderValue: 1 },
              { genderLabel: "女", genderValue: 0 },
            ],
          });
        }, 1000);
      });
    },
    // 字典请求携带参数
    // enum: () => getUserGender({ id: 1 }),
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "genderLabel", value: "genderValue" },
  },
  {
    // 多级 prop
    prop: "checkErrorNum",
    label: "年龄",
    search: {
      // 自定义 search 显示内容
      render: ({ searchParam }) => {
        return (
          <div class="flx-center">
            <el-input vModel_trim={searchParam.minAge} placeholder="最小年龄" />
            <span class="mr10 ml10">-</span>
            <el-input vModel_trim={searchParam.maxAge} placeholder="最大年龄" />
          </div>
        );
      },
    },
  },
  { prop: "packSection", label: "身份证号", search: { el: "input" } },
  {
    prop: "packSubject",
    label: "邮箱",
    search: { el: "input", tooltip: "我是搜索提示" },
    formatter: () => {
      return `邮箱111`;
    },
  },
  {
    prop: "qualityCheckStatus",
    search: { el: "input", tooltip: "我是搜索提示" },
    label: "居住地址",
  },
  {
    prop: "qualityCheckTaskId",
    label: "用户状态",
    enum: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              { userLabel: "启用", userStatus: 1 },
              { userLabel: "禁用", userStatus: 0 },
            ],
          });
        }, 1000);
      });
    },
    search: { el: "tree-select", props: { filterable: true } },
    fieldNames: { label: "userLabel", value: "userStatus" },
    render: (scope) => {
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch
              model-value={scope.row.status}
              active-text={scope.row.status ? "启用" : "禁用"}
              active-value={1}
              inactive-value={0}
              onClick={() => changeStatus(scope.row)}
            />
          ) : (
            <el-tag type={scope.row.status ? "success" : "danger"}>
              {scope.row.status ? "启用" : "禁用"}
            </el-tag>
          )}
        </>
      );
    },
  },
  {
    prop: "qualityCheckTime",
    label: "创建时间",
    headerRender,
    width: 180,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ["2022-11-12 11:35:00", "2022-12-12 11:35:00"],
    },
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 },
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 树形筛选切换
const changeTreeFilter = (val) => {
  ElMessage.success("请注意查看请求参数变化 🤔");
  // proTable.value?.pageable.pageNum = 1;
  // initParam.departmentId = val;
};

// 删除用户信息
const deleteAccount = async (params) => {
  console.log("删除用户信息");
};

// 批量删除用户信息
const batchDelete = async (id) => {
  console.log("批量删除用户信息");
};

// 重置用户密码
const resetPass = async (params) => {
  console.log("重置用户密码");
};

// 切换用户状态
const changeStatus = async (row) => {
  console.log("切换用户状态");
};

// 导出用户列表
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", {
    type: "warning",
  }).then(() => console.log("导出用户数据"));
};

// 批量添加用户
// const dialogRef = ref(null);
const batchAdd = () => {
  console.log("批量添加用户");
};

// 打开 drawer(新增、查看、编辑)
const openDrawer = (title, row = {}) => {
  console.log("新增、查看、编辑");
  // const params = {
  //   title,
  //   isView: title === "查看",
  //   row: { ...row },
  //   api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
  //   getTableList: proTable.value?.getTableList,
  // };
  // drawerRef.value?.acceptParams(params);
};
</script>

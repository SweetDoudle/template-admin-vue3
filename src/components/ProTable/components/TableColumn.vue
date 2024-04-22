<template>
  <RenderTableColumn v-bind="column" />
</template>

<script setup lang="jsx" name="TableColumn">
import { inject, ref, useSlots } from "vue";
import {
  filterEnum,
  formatValue,
  handleProp,
  handleRowAccordingToProp,
} from "@/utils/index";

const props = defineProps({
  column: {
    type: Object,
    default: () => ({}),
  },

  // type: {
  //   type: String,
  //   default: "index" || "selection" || "radio" || "expand" || "sort",
  // }, // 列类型
  // tag: {
  //   type: Boolean,
  //   default: false,
  // }, // 是否是标签展示
  // isShow: {
  //   type: Boolean,
  //   default: false,
  // }, // 是否显示在表格当中
  // search: {
  //   type: Object,
  //   default: () => {
  //     return {};
  //   },
  // }, // 搜索项配置
  // enum: {
  //   type: Array,
  //   default: () => {
  //     return [];
  //   },
  // }, // 枚举字典
  // isFilterEnum: {
  //   type: Boolean,
  //   default: false,
  // }, // 当前单元格值是否根据 enum 格式化（示例：enum 只作为搜索项数据）
  // fieldNames: {
  //   type: Object,
  //   default: () => {
  //     return {};
  //   },
  // }, // 指定 label && value && children 的 key 值
  // headerRender: {
  //   type: Function,
  //   default: () => {
  //     return {};
  //   },
  // }, // 自定义表头内容渲染（tsx语法）
  // render: {
  //   type: Function,
  //   default: () => {
  //     return {};
  //   },
  // }, // 自定义单元格内容渲染（tsx语法）
  // _children: {
  //   type: Object,
  //   default: () => {
  //     return {};
  //   },
  // }, // 多级表头
});
const { column } = props;
const slots = useSlots();

const enumMap = inject("enumMap", ref(new Map()));
console.log("enumMap==>", enumMap);
// 渲染表格数据
const renderCellData = (item, scope) => {
  const { formatter } = item;
  if (formatter) {
    return formatter(scope.row, scope.$index);
  }
  return enumMap.value.get(item.prop) && item.isFilterEnum
    ? filterEnum(
        handleRowAccordingToProp(scope.row, item.prop), //==> 1
        enumMap.value.get(item.prop), // ==>[{ genderLabel: "男", genderValue: 1 },{ genderLabel: "女", genderValue:0 },]
        item.fieldNames //==>{ label: "genderLabel", value: "genderValue" }
      )
    : formatValue(handleRowAccordingToProp(scope.row, item.prop));
};

// 获取 tag 类型
const getTagType = (item, scope) => {
  return filterEnum(
    handleRowAccordingToProp(scope.row, item.prop),
    enumMap.value.get(item.prop),
    item.fieldNames,
    "tag"
  );
};

const RenderTableColumn = (item) => {
  return (
    <>
      {item.isShow && (
        <el-table-column
          {...item}
          align={item.align ?? "center"}
          showOverflowTooltip={
            item.showOverflowTooltip ?? item.prop !== "operation"
          }
        >
          {{
            default: (scope) => {
              if (item._children)
                return item._children.map((child) => RenderTableColumn(child));
              if (item.render) return item.render(scope);
              if (slots[handleProp(item.prop)])
                return slots[handleProp(item.prop)](scope);
              if (item.tag)
                return (
                  <el-tag type={getTagType(item, scope)}>
                    {renderCellData(item, scope)}
                  </el-tag>
                );
              return renderCellData(item, scope);
            },
            header: (scope) => {
              if (item.headerRender) return item.headerRender(scope);
              if (slots[`${handleProp(item.prop)}Header`])
                return slots[`${handleProp(item.prop)}Header`](scope);
              return item.label;
            },
          }}
        </el-table-column>
      )}
    </>
  );
};
</script>

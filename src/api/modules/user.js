import request from "@/utils/request";

// 查询缓存详细
export function getUserList(data) {
  return request({
    url: "/qualityCheck/getQualityCheckTaskList",
    method: "post",
    data,
  });
}

// 查询部门下拉树结构
export function deptTree() {
  return request({
    url: "/system/user/deptTree",
    method: "get",
  });
}

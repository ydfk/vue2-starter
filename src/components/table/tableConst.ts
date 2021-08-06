/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-04-22 10:11:58
 * @LastEditors: ydfk
 * @LastEditTime: 2021-08-06 14:42:44
 */

import { TableActionKeyEnum } from "./tableEnum";
import { TableAction } from "./tableModel";

export const TABLE_ACTION_CREATE: TableAction = {
  key: TableActionKeyEnum.CREATE,
  title: "新增",
};

export const TABLE_ACTION_EDIT: TableAction = {
  key: TableActionKeyEnum.EDIT,
  title: "编辑",
};

export const TABLE_ACTION_DETAIL: TableAction = {
  key: TableActionKeyEnum.DETAIL,
  title: "详情",
};

export const TABLE_ACTION_DELETE: TableAction = {
  key: TableActionKeyEnum.DELETE,
  title: "删除",
};

export const TABLE_ACTION_COPY: TableAction = {
  key: TableActionKeyEnum.COPY,
  title: "复制",
};

export const TABLE_ACTION_DISABLE: TableAction = {
  key: TableActionKeyEnum.DISABLE,
  title: "禁用",
};

export const TABLE_ACTION_ENABLE: TableAction = {
  key: TableActionKeyEnum.ENABLE,
  title: "启用",
};

export const TABLE_ACTION_DOWNLOAD: TableAction = {
  key: TableActionKeyEnum.DOWNLOAD,
  title: "下载",
};

export const TABLE_PAGE_SIZE = 10; // 默认每页数量
export const TABLE_RECORD_KEY = "RecordKey";
export const TABLE_RECORD_WIDTH = 60;
export const TABLE_ACTION_KEY = "actionKey";
export const TABLE_DESC_ORDER_KEY = "UpdateAt";
export const TABLE_TAGS_COUNT = 5;

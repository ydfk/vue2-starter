/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-04-22 10:15:59
 * @LastEditors: ydfk
 * @LastEditTime: 2021-04-22 10:16:44
 */

import { TableOrderEnum, TableAlignEnum, TableActionKeyEnum, TableKeyEnum, TableFilterOperatorEnum } from "./tableEnum";

// table 数据源
export interface TableDataSource {
  key: string; //// 唯一确定dataSource的属性
  actions?: Array<TableAction>;
  moreActions?: Array<TableAction>; //// 按钮数量超过2个时候 其他的按钮存储

  [key: string]: any;
}

export interface TableSorterModel {
  column: TableColumn;
  columnKey: string;
  field: string;
  order: TableOrderEnum | false;
}

export interface TableColumn {
  key: string; //// 唯一确定column的属性
  title: string | JSX.Element; //// 列的标题
  width?: string | number; //// 宽度
  align?: TableAlignEnum; //// 对齐方式
  format?: string; /// 格式化
  formatFunc?: (data: any) => string | JSX.Element;
  filter?: boolean; /// 是否可筛选
  sorter?: boolean; /// 是否可排序
  dataIndex?: string;

  sortOrder?: TableOrderEnum | false; // 排序的受控属性
  sortKey?: string; // 特殊指定排序字段

  hidden?: boolean; //是否显示
  [key: string]: any;
}

// 列表操作列
export interface TableAction {
  key: TableActionKeyEnum; // 操作唯一确定key
  title: string; // 操作名称
}

// table分页设置
export interface TablePagination {
  current: number; // 当前页数
  total: number; // 总数据数量
  pageSize?: number; // 每页条数
  pageSizeOptions?: Array<string>; // 指定每页数量
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;

  [key: string]: any;
}

export interface TableChangeModel {
  key: TableKeyEnum;
  column: Array<TableColumn>;
  dataSource: Array<TableDataSource>;
  pagination: TablePagination;
}

// 刷新列表参数
export interface TableFetchDataSource {
  QueryApi: string; // 查询数据API
  Columns: Array<TableColumn>;
  PageCurrent: number;
  PageSize: number;
  Keyword: string;
  QueryParams: Record<string, unknown>;
  AscOrderBy: Array<string>; // 升序域
  DescOrderBy: Array<string>; // 降序域
  ActionFunc: (model: any) => Array<TableAction>;
  SheetName?: string;
}

export interface TableFilterDescriptor {
  member: string;
  value: any;
  operator: TableFilterOperatorEnum;
}

// 分页查询
export interface TablePageQuery {
  pageNum: number; // 查询页
  pageSize: number; // 每页数量
  keyword: string;
  // AscOrderBy?: Array<string>; // 升序域
  // DescOrderBy?: Array<string>; // 降序域
  // Filters?: Array<TableFilterDescriptor>;
}

export interface TableExportModel {
  total: number;
  fileName?: string;
}

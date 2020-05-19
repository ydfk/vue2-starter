/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : tableService.ts
 * Author : liyuhang
 * Date : 2020-03-04 21:53:15
 */

import {
  BaseModel,
  PagedResult,
  TableAction,
  TableColumn,
  TableDataSource,
  TableExportModel,
  TableFetchDataSource,
  TableFilterDescriptor,
  TablePageQuery,
  UserModel,
} from "@/commons/models";
import { TABLE_ACTION_KEY, TABLE_DESC_ORDER_KEY, TABLE_RECORD_KEY } from "@/commons/constants";
import { TableAlignEnum, TableFilterOperatorEnum } from "@/commons/enums";
import moment from "moment";
import axios from "@/apis/axios";
import store from "@/store";
import { A_LOADED, A_LOADING, G_USER } from "@/store/store.types";
import numeral from "numeral";

export const initColumns = (columns: Array<TableColumn>, showRecord: boolean): Array<TableColumn> => {
  let columnsWithRecord: Array<TableColumn> = columns;
  if (showRecord) {
    columnsWithRecord = [
      {
        key: TABLE_RECORD_KEY,
        title: "序号",
        width: "50px",
        align: TableAlignEnum.CENTER,
        filter: false,
        sorter: false,
      },
      ...columns,
    ];
  }

  columnsWithRecord.forEach((c) => {
    if (c.align === null) {
      c.align = TableAlignEnum.LEFT;
    }
    if (!c.dataIndex) {
      c.dataIndex = c.key;
    }

    // if (c.sorter == false) {
    //   c.sorter = false;
    // } else if (c.sortKey || c.sorter || c.filter !== false) {
    //   c.sorter = true;
    // } else {
    //   c.sorter = false;
    // }
    c.sorter = false;
    c.filter = false;
  });
  return columnsWithRecord;
};

export const initColumnActions = (dataSources: Array<TableDataSource>, columns: Array<TableColumn>) => {
  columns = columns.filter((x) => x.key != TABLE_ACTION_KEY);

  if (dataSources && columns) {
    let maxActionTitleLength = 0;
    let maxActionsLength = 0;
    dataSources.forEach((d) => {
      if (d.actions && d.actions.length > 0) {
        let actionTitleLength = 0;
        let firstAction = d.actions[0];
        let secondAction;

        //// 超过三个按钮 放入  moreActions 中
        if (d.actions.length === 1 || d.actions.length === 2) {
          actionTitleLength = firstAction.title.length;
        } else if (d.actions.length === 3) {
          secondAction = d.actions[1];
          actionTitleLength = firstAction.title.length + secondAction.title.length + d.actions[2].title.length;
          [firstAction, secondAction, ...d.moreActions] = d.actions;
        } else {
          secondAction = d.actions[1];
          actionTitleLength = firstAction.title.length + 2;
          [firstAction, secondAction, ...d.moreActions] = d.actions;
        }

        if (actionTitleLength > maxActionsLength) {
          maxActionsLength = actionTitleLength;
          maxActionTitleLength = actionTitleLength * 40;
        }
      }
    });
    if (maxActionTitleLength > 0) {
      let actionColumnWidth = maxActionTitleLength + 15;

      if (actionColumnWidth > 200) {
        actionColumnWidth = 200;
      }

      columns.push({
        key: TABLE_ACTION_KEY,
        dataIndex: TABLE_ACTION_KEY,
        title: "操作",
        width: `${actionColumnWidth}px`,
        align: TableAlignEnum.CENTER,
        filter: false,
        sorter: false,
        //scopedSlots: { customRender: "action" }
      });
    }
  }

  return columns;
};

const page = async (queryApi: string, pageQuery: TablePageQuery): Promise<PagedResult<BaseModel>> => {
  //const noOrders = pageQuery.AscOrderBy == undefined && pageQuery.DescOrderBy == undefined;
  //@ts-ignore
  // const emptyOrders = !noOrders && pageQuery.AscOrderBy.length == 0 && pageQuery.DescOrderBy.length == 0;
  // if (noOrders || emptyOrders) {
  //   pageQuery.DescOrderBy = [TABLE_DESC_ORDER_KEY];
  // }

  const result = await axios.post<PagedResult<any>>(queryApi, pageQuery);
  if (
    typeof result === "object" &&
    Object.prototype.hasOwnProperty.call(result, "totalCount") &&
    Object.prototype.hasOwnProperty.call(result, "pageResults")
  ) {
    return result;
  } else {
    return {
      totalCount: result.totalCount,
      pageResults: result.pageResults,
    };
  }
};

const formatDataSource = (value: any, format: string | undefined, formatFunc: ((data: any) => string) | undefined, column: any) => {
  let result = value;
  if (formatFunc && typeof formatFunc == "function") {
    result = formatFunc(column);
  } else {
    if (value) {
      if (format) {
        if (typeof value == "number") {
          result = numeral(value).format(format);
        } else {
          const date = moment(value);
          if (date.isValid()) {
            result = date.format(format);
            if (result.indexOf("0001-01-01") > -1 || result.indexOf("1970-01-01") > -1) {
              return "";
            }
          }
        }
      }
    }
  }

  return result;
};

const getDataSource = (
  data: Array<BaseModel>,
  columns: Array<TableColumn>,
  page: number,
  pageSize: number,
  actionFunc: (model: BaseModel, user: UserModel) => Array<TableAction>
): Array<TableDataSource> => {
  const dataSources: Array<TableDataSource> = [];

  if (data) {
    let record = (page - 1) * pageSize + 1;
    data.forEach((d) => {
      const dataSource: TableDataSource = { key: d.id.toString(), [TABLE_RECORD_KEY]: record };
      Object.entries(d).forEach(([key, value]) => {
        dataSource[key] = value;
        columns
          .filter((f) => f.format || f.formatFunc)
          .forEach((c) => {
            if (c.key === key.toString()) {
              dataSource[c.key] = formatDataSource(value, c.format, c.formatFunc, d);
            }
          });
      });

      if (typeof actionFunc == "function") {
        dataSource.actions = actionFunc(d, store.getters[G_USER]);
      }

      dataSources.push(dataSource);
      record++;
    });
  }

  return dataSources;
};

export const fetchDataSource = async (fetch: TableFetchDataSource, localData: BaseModel[]): Promise<PagedResult<TableDataSource>> => {
  const pageQuery = Object.assign(fetch.QueryParams, {
    pageIndex: fetch.PageCurrent,
    pageSize: fetch.PageSize,
    searchText: fetch.SearchText || "",
    // AscOrderBy: fetch.AscOrderBy,
    // DescOrderBy: fetch.DescOrderBy,
    // Filters: getFilters(fetch.Columns, fetch.SearchText || "")
  });

  let pagedData: PagedResult<BaseModel> = {
    totalCount: 0,
    pageResults: [],
  };

  if ((localData && localData.length > 0) || !fetch.QueryApi) {
    pagedData.totalCount = localData.length;

    if (localData.length <= fetch.PageSize) {
      pagedData.pageResults = localData;
    } else {
      pagedData.pageResults = localData.slice((fetch.PageCurrent - 1) * fetch.PageSize, fetch.PageSize * fetch.PageCurrent);
    }
  } else {
    pagedData = await page(fetch.QueryApi, pageQuery);
  }

  const dataSources = getDataSource(pagedData.pageResults, fetch.Columns, fetch.PageCurrent, fetch.PageSize, fetch.ActionFunc);

  return {
    totalCount: pagedData.totalCount,
    pageResults: dataSources,
  };
};

const getFilters = (columns: Array<TableColumn>, searchText: string) => {
  const filters: Array<TableFilterDescriptor> = [];
  if (searchText) {
    columns
      .filter((c) => c.filter != false)
      .forEach((c) => {
        filters.push({
          member: c.key,
          operator: TableFilterOperatorEnum.Contains,
          value: searchText,
        });
      });
  }

  return filters;
};

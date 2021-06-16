/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : tableService.ts
 * Author : liyuhang
 * Date : 2020-03-04 21:53:15
 */

import { BaseModel, PagedResult } from "@/commons/models/baseModel";
import { TableAction, TableColumn, TableDataSource, TableFetchDataSource, TableFilterDescriptor, TablePageQuery } from "./tableModel";
import { TABLE_ACTION_KEY, TABLE_RECORD_KEY } from "./tableConst";
import { TableAlignEnum, TableFilterOperatorEnum } from "./tableEnum";
import moment from "moment";
import axios from "@/apis/axios";
import numeral from "numeral";

export const initColumns = (columns: Array<TableColumn>, showRecord: boolean): Array<TableColumn> => {
  let columnsWithRecord: Array<TableColumn> = columns;
  if (showRecord) {
    columnsWithRecord = [
      {
        key: TABLE_RECORD_KEY,
        title: "序号",
        width: "60px",
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
        let dividingLineLength = 0;
        let firstAction = d.actions[0];
        let secondAction: TableAction;
        let thirdAction: TableAction;
        //// 超过三个按钮 放入  moreActions 中
        if (d.actions.length === 1) {
          actionTitleLength = firstAction.title.length;
          dividingLineLength = 0;
        } else if (d.actions.length === 2) {
          secondAction = d.actions[1];
          actionTitleLength = firstAction.title.length + secondAction.title.length;
          dividingLineLength = 1;
        } else if (d.actions.length === 3) {
          secondAction = d.actions[1];
          thirdAction = d.actions[2];
          actionTitleLength = firstAction.title.length + secondAction.title.length + thirdAction.title.length;
          dividingLineLength = 2;
          [firstAction, secondAction, ...d.moreActions] = d.actions;
        } else {
          secondAction = d.actions[1];
          // 更多 和 箭头
          actionTitleLength = firstAction.title.length + secondAction.title.length + 2 + 1;
          dividingLineLength = 2;
          [firstAction, secondAction, ...d.moreActions] = d.actions;
        }

        if (actionTitleLength > maxActionsLength) {
          maxActionsLength = actionTitleLength;
          maxActionTitleLength = actionTitleLength * 18 + dividingLineLength * 10;
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
  } else if (Array.isArray(result)) {
    return {
      totalCount: result.length,
      pageResults: result,
    };
  } else {
    return {
      totalCount: result.totalCount,
      pageResults: result.pageResults,
    };
  }
};

const formatDataSource = (value: any, format: string | undefined, formatFunc: ((data: any) => string | JSX.Element) | undefined, column: any) => {
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
  actionFunc: (model: BaseModel) => Array<TableAction>
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
        dataSource.actions = actionFunc(d);
      }

      dataSources.push(dataSource);
      record++;
    });
  }

  return dataSources;
};

export const fetchDataSource = async (fetch: TableFetchDataSource, localData: BaseModel[]): Promise<PagedResult<TableDataSource>> => {
  const pageQuery = Object.assign(
    {
      pageNum: fetch.PageCurrent,
      pageSize: fetch.PageSize,
      keyword: fetch.Keyword || "",
      // AscOrderBy: fetch.AscOrderBy,
      // DescOrderBy: fetch.DescOrderBy,
      // Filters: getFilters(fetch.Columns, fetch.Keyword || "")
    },
    fetch.QueryParams
  );

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

const getFilters = (columns: Array<TableColumn>, keyword: string) => {
  const filters: Array<TableFilterDescriptor> = [];
  if (keyword) {
    columns
      .filter((c) => c.filter != false)
      .forEach((c) => {
        filters.push({
          member: c.key,
          operator: TableFilterOperatorEnum.Contains,
          value: keyword,
        });
      });
  }

  return filters;
};

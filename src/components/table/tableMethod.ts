/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : tableMethod.ts
 * Author : liyuhang
 * Date : 2020-03-04 21:53:15
 */

import { BaseModel, PagedResult } from "@/commons/models/baseModel";
import {
  TableAction,
  TableColumn,
  TableDataSource,
  TableExportModel,
  TableFetchDataSource,
  TableFilterDescriptor,
  TablePageQuery,
  TableQueryKeyModel,
  TableResultKeyModel,
} from "./tableModel";
import { TABLE_ACTION_KEY, TABLE_DESC_ORDER_KEY, TABLE_RECORD_KEY, TABLE_RECORD_WIDTH } from "./tableConst";
import { TableAlignEnum, TableFilterOperatorEnum } from "./tableEnum";
import moment from "moment";
import axios from "@/apis/axios";
import numeral from "numeral";
import store from "@/store";
import { A_LOADED, A_LOADING } from "@/store/store.types";
import { ExportSheetModel, ExportToExcel } from "./export/exportToExcel";

export const initColumns = (columns: Array<TableColumn>, showRecord: boolean, tableScroll: Record<string, any>): Array<TableColumn> => {
  let columnsWithRecord: Array<TableColumn> = columns;
  if (showRecord) {
    let recordFixed = false;
    if (typeof tableScroll === "object" && JSON.stringify(tableScroll) !== "{}") {
      recordFixed = true;
    }

    if (columns.some((x) => x.fixed != undefined)) {
      recordFixed = true;
    }

    columnsWithRecord = [
      {
        key: TABLE_RECORD_KEY,
        title: "序号",
        width: TABLE_RECORD_WIDTH,
        align: TableAlignEnum.CENTER,
        filter: false,
        sorter: false,
        fixed: recordFixed,
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

    if (c.sorter == false || c.sorter == undefined) {
      c.sorter = false;
    } else if (c.sortKey || c.sorter || c.filter !== false) {
      c.sorter = true;
    } else {
      c.sorter = false;
    }
  });

  return columnsWithRecord;
};

export const initColumnActions = (dataSources: TableDataSource[], columns: TableColumn[], tableId: string) => {
  columns = columns.filter((x) => x.key != TABLE_ACTION_KEY);
  let actionColumnWidth = 0;

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
      actionColumnWidth = maxActionTitleLength + 15;

      if (actionColumnWidth > 200) {
        actionColumnWidth = 200;
      }

      columns.push({
        key: TABLE_ACTION_KEY,
        dataIndex: TABLE_ACTION_KEY,
        title: "操作",
        width: actionColumnWidth,
        align: TableAlignEnum.CENTER,
        filter: false,
        sorter: false,
        //scopedSlots: { customRender: "action" }
      });
    }
  }

  //设置列表宽度
  const offsetWidth = document.getElementById(tableId)?.offsetWidth || 0;
  const tableWidth = offsetWidth - TABLE_RECORD_WIDTH - actionColumnWidth;

  columns.forEach((c) => {
    if (typeof c.width == "string") {
      if (c.width?.includes("px")) {
        c.width = +c.width.split("px")[0];
      } else if (c.width?.includes("%")) {
        const cwd = +c.width.split("%")[0];
        c.width = (+cwd * tableWidth) / 100;
      }
    }
  });

  return columns;
};

export const fetchDataSource = async (
  fetch: TableFetchDataSource,
  localData: BaseModel[],
  tableQueryKey: TableQueryKeyModel,
  tableResultKey: TableResultKeyModel
): Promise<PagedResult<TableDataSource>> => {
  const pageQuery = Object.assign(
    {
      [tableQueryKey.pageCurrent]: fetch.pageCurrent,
      [tableQueryKey.pageSize]: fetch.pageSize,
      [tableQueryKey.searchText]: fetch.searchText || "",
      [tableQueryKey.ascOrderBy]: fetch.ascOrderBy,
      [tableQueryKey.descOrderBy]: fetch.descOrderBy,
      [tableQueryKey.filters]: getFilters(fetch.columns, fetch.searchText || ""),
    },
    fetch.queryParams
  );

  let pagedData: PagedResult<BaseModel> = {
    totalCount: 0,
    pageResults: [],
  };

  if (fetch.queryListApi) {
    localData = await axios.post(fetch.queryListApi, pageQuery);
  }

  if ((!localData || localData.length == 0) && fetch.queryApi) {
    pagedData = await page(fetch.queryApi, pageQuery, tableQueryKey, tableResultKey);

    if (pagedData.totalCount > 0 && pagedData.pageResults.length == 0) {
      pageQuery[tableQueryKey.pageCurrent] = pagedData.totalCount % (pageQuery[tableQueryKey.pageSize] as number);
      pagedData = await page(fetch.queryApi, pageQuery, tableQueryKey, tableResultKey);
    }
  } else {
    //本地数据 前端模糊查询
    if (fetch.searchText) {
      localData = localData.filter((row) => {
        return Object.keys(row).some((key) => {
          return String(row[key]).toLowerCase().indexOf(fetch.searchText) > -1;
        });
      });
    }

    pagedData.totalCount = localData.length;

    if (localData.length <= fetch.pageSize) {
      pagedData.pageResults = localData;
    } else {
      pagedData.pageResults = localData.slice((fetch.pageCurrent - 1) * fetch.pageSize, fetch.pageSize * fetch.pageCurrent);
    }
  }
  const dataSources = getDataSource(
    pagedData.pageResults,
    fetch.columns,
    pageQuery[tableQueryKey.pageCurrent] as number,
    fetch.pageSize,
    fetch.actionFunc
  );

  return {
    totalCount: pagedData.totalCount,
    pageResults: dataSources,
  };
};

export const tableExport = async (
  fetchArray: Array<TableFetchDataSource>,
  exportModel: TableExportModel,
  tableQueryKey: TableQueryKeyModel,
  tableResultKey: TableResultKeyModel
): Promise<void> => {
  await store.dispatch(A_LOADING);

  const name = exportModel && exportModel.fileName;
  const sheets: Array<ExportSheetModel> = [];

  const promiseArray: any[] = [];

  for (const fetch of fetchArray) {
    let pageQuery = {
      [tableQueryKey.pageCurrent]: 1,
      [tableQueryKey.pageSize]: exportModel.total,
      [tableQueryKey.searchText]: fetch.searchText || "",
    };

    if (fetch.queryParams) {
      pageQuery = Object.assign(fetch.queryParams, pageQuery);
    }

    const allData = await page(fetch.queryApi, pageQuery, tableQueryKey, tableResultKey);

    if (allData && allData.pageResults) {
      import("./export/exportToExcel").then((excel) => {
        const columns = fetch.columns;
        const header: Array<string> = [];
        const headerKey: Array<string> = [];
        const exportData: Array<Array<any>> = [];
        columns.forEach((c) => {
          if (c.key != TABLE_ACTION_KEY && c.key != TABLE_RECORD_KEY) {
            header.push(c.title as string);
            headerKey.push(c.key);
          }
        });
        allData.pageResults.forEach((d) => {
          const data: Array<any> = [];
          headerKey.forEach((k) => {
            const value = d[k];
            if (value && value.toString().indexOf("T") > 0) {
              const date = moment(value);
              if (date.isValid()) {
                data.push(date.toDate());
              } else {
                data.push(value);
              }
            } else {
              if (value.indexOf("0001-01-01") > -1 || value.indexOf("1970-01-01") > -1) {
                data.push("");
              } else {
                data.push(value);
              }
            }
          });
          exportData.push(data);
        });

        sheets.push({ header: header, data: exportData, sheetName: fetch.sheetName || "sheet1" });
      });
    }

    promiseArray.push(allData);
  }

  Promise.all(promiseArray).then(() => {
    ExportToExcel({
      fileName: name || "列表导出",
      sheets: sheets,
      autoWidth: true,
    });
  });

  await store.dispatch(A_LOADED);
};

const page = async (
  queryApi: string,
  pageQuery: Record<string, unknown>,
  tableQueryKey: TableQueryKeyModel,
  tableResultKey: TableResultKeyModel
): Promise<PagedResult<BaseModel>> => {
  const noOrders = pageQuery[tableQueryKey.ascOrderBy] == undefined && pageQuery[tableQueryKey.descOrderBy] == undefined;

  const emptyOrders =
    !noOrders && (pageQuery[tableQueryKey.ascOrderBy] as []).length == 0 && (pageQuery[tableQueryKey.descOrderBy] as []).length == 0;
  if (noOrders || emptyOrders) {
    pageQuery[tableQueryKey.descOrderBy] = [TABLE_DESC_ORDER_KEY];
  }

  const result = await axios.post<any>(queryApi, pageQuery);

  if (
    typeof result === "object" &&
    Object.prototype.hasOwnProperty.call(result, tableResultKey.totalCount) &&
    Object.prototype.hasOwnProperty.call(result, tableResultKey.pageResults)
  ) {
    return result;
  } else if (Array.isArray(result)) {
    return {
      totalCount: result.length,
      pageResults: result,
    };
  } else {
    return {
      totalCount: result[tableResultKey.totalCount],
      pageResults: result[tableResultKey.pageResults],
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

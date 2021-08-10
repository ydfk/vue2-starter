/*
 * Copyright (c) TZXX. All rights reserved.
 * ProjectName: Mms.Interaction.Web
 * FileName : exportToExcel.ts
 * Author : liyuhang
 * Date : 2019-05-06 16:29:36
 */
import XLSX, { CellObject, ColInfo, WorkBook, WorkSheet } from "xlsx";
import moment from "moment";
import fileSaver from "file-saver";
import { notification } from "ant-design-vue";

export interface ExportModel {
  fileName: string; // 文件名称
  bookType?: "xlsx" | "xls";
  autoWidth?: boolean;
  sheets: Array<ExportSheetModel>;
}

export interface ExportSheetModel {
  header: Array<string>; // 表头
  data: Array<any>; // 数据
  sheetName?: string;
}

const dateNum = (date: Date): number => {
  // var epoch = Date.parse(date);
  // Date.UTC(1899, 11, 30);
  // return (epoch - Date.UTC(1899, 11, 30)) / (24 * 60 * 60 * 1000);
  // return (moment(date).unix() - moment(new Date(1970, 1, 1, 0, 0, 0, 0)).unix()) / (24 * 60 * 60);
  const epoch = moment(date).valueOf();
  const a = Date.UTC(1899, 11, 29, 16);
  return (epoch - a) / (24 * 60 * 60 * 1000);
};

const getSheetFromData = (data: Array<any>): WorkSheet => {
  const ws: WorkSheet = {};
  const range = {
    s: {
      c: 10000000,
      r: 10000000,
    },
    e: {
      c: 0,
      r: 0,
    },
  };

  for (let R = 0; R != data.length; ++R) {
    for (let C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;

      const cell: CellObject = {
        v: data[R][C],
        t: "s",
        z: "",
      };

      if (cell.v != null) {
        const cellRef = XLSX.utils.encode_cell({
          c: C,
          r: R,
        });

        if (typeof cell.v === "number") {
          cell.t = "n";
        } else if (typeof cell.v === "boolean") {
          cell.t = "b";
        } else if (cell.v instanceof Date) {
          cell.t = "n";
          cell.z = XLSX.SSF.get_table()[14];
          cell.v = dateNum(cell.v);
        } else {
          cell.t = "s";
        }

        ws[cellRef] = cell;
      }
    }
  }

  if (range.s.c < 10000000) {
    ws["!ref"] = XLSX.utils.encode_range(range);
  }

  return ws;
};

const getColsFromData = (data: Array<any>): Array<ColInfo> => {
  const colWidth: Array<Array<ColInfo>> = [];

  data.forEach((d) => {
    const col: Array<ColInfo> = [];
    Object.values(d).forEach((r: any) => {
      if (r == null) {
        col.push({
          wch: 10,
        });
      } else {
        let length = r.toString().length;
        //// 中文
        if (r.toString().charCodeAt(0) > 255) {
          length = length * 2;
        }

        col.push({
          wch: length > 100 ? 100 : length,
        });
      }
    });
    colWidth.push(col);
  });

  const result = colWidth[0];
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      // @ts-ignore
      if (result[j].wch < colWidth[i][j].wch) {
        result[j].wch = colWidth[i][j].wch;
      }
    }
  }

  return result;
};

const convertToBlob = (workBookOut: any): Blob => {
  const buf = new ArrayBuffer(workBookOut.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i != workBookOut.length; ++i) {
    view[i] = workBookOut.charCodeAt(i) & 0xff;
  }
  return new Blob([view], {
    type: "application/octet-stream",
  });
};

export const ExportToExcel = (exportModel: ExportModel) => {
  const filename = `${exportModel.fileName || "导出"}${moment().format("YYYYMMDDHHmmss")}`;
  const bookType = exportModel.bookType || "xlsx";

  const workBook: WorkBook = {
    SheetNames: [],
    Sheets: {},
  };

  exportModel.sheets.forEach((value, index, array) => {
    const workSheetName = value.sheetName || "Sheet1";

    const data = [value.header, ...value.data];

    const workSheet = getSheetFromData(data);

    if (exportModel.autoWidth) {
      workSheet["!cols"] = getColsFromData(data);
    }

    workBook.SheetNames.push(workSheetName);
    workBook.Sheets[workSheetName] = workSheet;
  });

  const workBookOut = XLSX.write(workBook, {
    bookType: bookType,
    bookSST: false,
    type: "binary",
  });
  const blob = convertToBlob(workBookOut);

  fileSaver.saveAs(blob, `${filename}.${bookType}`);

  notification.success({
    message: "导出完成",
    description: `文件[${filename}.${bookType}]导出完成`,
  });
};

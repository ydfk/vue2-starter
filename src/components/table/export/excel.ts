/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: 20200713(106026)
 * FileName : excel.ts
 * Author : lyh67
 * Date : 2020-07-28 15:26:28
 */

import xlsx from "xlsx";

export interface SheetModel {
  [key: string]: any;
}

export interface ExcelModel {
  sheetName: string;
  sheet: SheetModel[];
}

export const fileToExcel = (file): Promise<ExcelModel[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        const wb = xlsx.read(data, {
          type: "binary",
        });
        const result: ExcelModel[] = [];
        for (const sheetName of wb.SheetNames) {
          const sheet = wb.Sheets[sheetName];
          result.push({
            sheetName: sheetName,
            sheet: xlsx.utils.sheet_to_json(sheet, { header: "A" }),
          });
        }

        resolve(result);
      }
    };

    reader.readAsBinaryString(file);
  });
};

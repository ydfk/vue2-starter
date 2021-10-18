/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : demoApis.ts
 * Author : lyh67
 * Date : 2021-10-15 10:37:16
 */

import { UserModel } from "@/commons/models/loginModel";
import axios from "@/apis/axios";
import { DemoTableModel } from "@/commons/models/demoModel";

export const getDemoTableData = (): Promise<DemoTableModel[]> => {
  return axios.get<DemoTableModel[]>(`localTable`);
};

/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : apis.ts
 * Author : liyuhang
 * Date : 2020-02-29 18:09:06
 */

import axios from "@/apis/axios";
import { API_LOGIN, API_REFRESH_TOKEN } from "@/apis/apiConst";
import { ApiReturn } from "@/commons/models/baseModel";
import { TokenModel, UserModel } from "@/commons/models/loginModel";

export const apiLogin = (code: string, password: string): Promise<ApiReturn<TokenModel>> => {
  return axios.get<ApiReturn<TokenModel>>(`${API_LOGIN}?code=${code}&password=${password}`, undefined, false);
};

export const apiRefreshToken = (): Promise<TokenModel> => {
  return axios.get<TokenModel>(API_REFRESH_TOKEN);
};

export const apiGetLoginUser = (): Promise<UserModel> => {
  return axios.get<UserModel>(`user/login`);
};

/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : apis.ts
 * Author : liyuhang
 * Date : 2020-02-29 18:09:06
 */

import { ApiReturn, TokenModel, UserModel } from "@/commons/models";
import axios from "@/apis/axios";

export const API_REFRESH_TOKEN = "token/refresh";
export const API_LOGIN = "token";

// 无需token的api
export const NO_TOKEN_APIS = [API_LOGIN];

export const apiLogin = (code: string, password: string): Promise<ApiReturn<TokenModel>> => {
  return axios.get<ApiReturn<TokenModel>>(`${API_LOGIN}?code=${code}&password=${password}`, undefined, false);
};

export const apiRefreshToken = (): Promise<TokenModel> => {
  return axios.get<TokenModel>(API_REFRESH_TOKEN);
};

export const apiGetLoginUser = (): Promise<UserModel> => {
  return axios.get<UserModel>(`user/login`);
};

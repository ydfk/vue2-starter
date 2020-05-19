/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : axios.ts
 * Author : liyuhang
 * Date : 2020-02-29 17:54:24
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import store from "@/store/index";
import router from "@/router/index";
import { ContentType, HttpMethod } from "@/commons/enums";
import { getUrlWithOutParams } from "@/commons/method";
import { ROUTER_ERROR, ROUTER_LOGIN, TOKEN_EXPIRE_MSG } from "@/commons/constants";
import { A_USER_CHECK, G_TOKEN } from "@/store/store.types";
import { message } from "ant-design-vue";
import { ApiReturn } from "@/commons/models";
import { API_REFRESH_TOKEN, NO_TOKEN_APIS } from "@/apis/apis";

interface AxiosOption extends AxiosRequestConfig {
  contentType?: ContentType;
}

const setToken = async (config: AxiosRequestConfig) => {
  config.headers = Object.assign(config.headers, {
    "Cache-Control": "no-cache",
  });

  const outParamsUrl = getUrlWithOutParams(config.url);
  if (config.url && NO_TOKEN_APIS.every((x) => x !== outParamsUrl)) {
    if (config.url === API_REFRESH_TOKEN) {
      config.headers.Authorization = `Bearer ${store.getters[G_TOKEN]}`;
    } else {
      try {
        const token = await store.dispatch(A_USER_CHECK);
        config.headers.Authorization = `Bearer ${token}`;
      } catch (e) {
        await message.warn(TOKEN_EXPIRE_MSG);
        await router.replace({
          name: ROUTER_LOGIN,
          params: { redirect: router.currentRoute.fullPath },
        });
      }
    }
  }

  if (config.method === "get") {
    if (!config.params) {
      Object.assign(config, {
        params: {
          timestamp: new Date().getTime(),
        },
      });
    } else {
      Object.assign(config.params, {
        timestamp: new Date().getTime(),
      });
    }
  }
};

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 60000,
  responseType: "json",
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Cache-Control": "no-cache",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    await setToken(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class AxiosUtil {
  private static instance: AxiosUtil;
  axios: AxiosInstance;

  constructor() {
    this.axios = axiosInstance;
  }

  static getInstance(): AxiosUtil {
    if (this.instance instanceof this === false) {
      this.instance = new this();
    }
    return this.instance;
  }

  public base(option: AxiosOption) {
    const contentType = option.contentType == null ? ContentType.JSON : option.contentType;
    const data = option.data;

    return this.axios.request({
      method: option.method || HttpMethod.POST,
      url: option.url,
      data: JSON.stringify(data),
      headers: {
        "Content-Type": contentType,
      },
      responseType: option.responseType != null ? option.responseType : "json",
    });
  }

  public async get<T = any>(url: string, data?: object, convertResult = true): Promise<T> {
    const res = await this.axios.get(url, { params: data });
    return this.handelResponse<T>(res, convertResult);
  }

  public async post<T = any>(url: string, data?: object, convertResult = true): Promise<T> {
    const res = await this.axios.post(url, JSON.stringify(data));
    return this.handelResponse<T>(res, convertResult);
  }

  public async put<T = any>(url: string, data?: object, convertResult = true): Promise<T> {
    const res = await this.axios.put(url, JSON.stringify(data));
    return this.handelResponse<T>(res, convertResult);
  }

  public async patch<T = any>(url: string, data?: object, convertResult = true): Promise<T> {
    const res = await this.axios.patch(url, JSON.stringify(data));
    return this.handelResponse<T>(res, convertResult);
  }

  public async delete<T = any>(url: string, data?: object, convertResult = true): Promise<T> {
    const res = await this.axios.delete(url, { data: data });
    return this.handelResponse<T>(res, convertResult);
  }

  public handelResponse<T = any>(res: AxiosResponse, convertResult = true): T {
    try {
      if (res.status === 200) {
        const apiReturn = res.data as ApiReturn;
        if (convertResult) {
          if (!apiReturn.result) {
            const errorMsg = apiReturn.msg;
            router.replace({ name: ROUTER_ERROR, params: { msg: errorMsg } });
          }
          return apiReturn.data as T;
        } else {
          return res.data as T;
        }
      } else {
        throw new Error();
      }
    } catch (e) {
      const msg = `axios error! status:[${res.status}]statusText:[${res.statusText}]mgs:[${e}]`;
      console.log(msg);
      throw e;
    }
  }
}

export default AxiosUtil.getInstance() as AxiosUtil;

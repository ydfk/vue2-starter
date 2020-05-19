/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : util.js
 * Author : lyh67
 * Date : 2020-05-19 13:51:37
 */

const resBody = {
  result: false,
  data: null,
  msg: "",
};

export const builder = (result, data, msg) => {
  resBody.data = data;
  if (msg !== undefined && msg !== null) {
    resBody.msg = msg;
  }
  resBody.result = result || false;

  return resBody;
};

export const getBody = (options) => {
  return options.body && JSON.parse(options.body);
};

export const getQueryParameters = (options) => {
  const url = options.url;
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
};

/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : enums.ts
 * Author : liyuhang
 * Date : 2020-02-28 16:54:02
 */
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export enum ContentType {
  JSON = "application/json;charset=UTF-8",
  FORM = "application/x-www-form-urlencoded; charset=UTF-8",
  TEXT = "text/xml",
  BLOB = "blob",
  FORMDATA = "multipart/form-data",
  Other = "application/octet-stream",
  Arraybuffer = "arraybuffer",
}

export enum BusEnum {
  formSubmit = "formSubmit",
  refreshTable = "refreshTable",
  evaluationModelScore = "evaluationModelScore",
}

export enum RouterEnum {
  error = "error",
  home = "home",
  login = "login",
  example = "example",
}

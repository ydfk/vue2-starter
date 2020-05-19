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

export enum TableKeyEnum {
  MeetingList,
  RunningMeetingList = 1,
  AuthCodeList = 2,
  UserList = 3,
  Platform = 4,
  OrderList = 5,
}

export enum TableAlignEnum {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
}

export enum TableActionKeyEnum {
  EDIT = "edit",
  DETAIL = "detail",
  DELETE = "delete",
  MODIFY_PASSWORD = "modifyPassword",
  lOCK = "lock",
  UNLOCK = "unlock",
  STOP = "stop",
  JOIN = "join",
  INVITE = "invite",
  CHECK = "check",
  COPY = "copy",
  RESTART = "reStart",
  START = "start",
  PAY = "pay",
  MODIFY_BUY = "modifyBuy",
}

export enum TableOrderEnum {
  ascend = "ascend",
  descend = "descend",
}

export enum TableFilterOperatorEnum {
  /// <summary>
  /// 小于
  /// </summary>
  IsLessThan,

  /// <summary>
  /// 小于等于
  /// </summary>
  IsLessThanOrEqualTo,

  /// <summary>
  /// 等于
  /// </summary>
  IsEqualTo,

  /// <summary>
  /// 不等于
  /// </summary>
  IsNotEqualTo,

  /// <summary>
  /// 大于等于
  /// </summary>
  IsGreaterThanOrEqualTo,

  /// <summary>
  /// 大于
  /// </summary>
  IsGreaterThan,

  /// <summary>
  /// 包含
  /// </summary>
  Contains,

  /// <summary>
  /// 不包含
  /// </summary>
  DoesNotContain,
}

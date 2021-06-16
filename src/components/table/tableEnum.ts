/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-04-22 10:11:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-05-27 14:28:06
 */
export enum TableKeyEnum {
  demo = 0,
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
  PREVIEW = "preview",
  SELECT = "select",
  COPY = "copy",
  DISABLE = "disable",
  ENABLE = "enable",
  QUOTE = "quote",
  EDITROLE = "editRole",
  CREATE = "create",
  ORDER = "order",
  EVALUATION = "evaluation",
  DOWNLOAD = "download",
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
  /// 应等于
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

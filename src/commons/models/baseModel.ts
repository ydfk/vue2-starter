/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-06-15 15:27:20
 * @LastEditors: ydfk
 * @LastEditTime: 2021-06-15 15:28:17
 */
export interface BaseModel {
  id: string;
  createBy?: string;
  createAt?: Date;
  updateBy?: string;
  updateAt?: Date;
  dataStatus?: boolean;

  [key: string]: any;
}

export interface ApiReturn<T = any> {
  result?: boolean;
  msg: string;
  data?: T;
}

export interface ItemSourceModel {
  value: string;
  text: string;
}

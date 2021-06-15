/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-06-15 15:29:13
 * @LastEditors: ydfk
 * @LastEditTime: 2021-06-15 15:29:35
 */
import { BaseModel } from "./baseModel";

export interface TokenModel {
  token: string;
  tokenExpiration: number;
}

export interface UserModel extends BaseModel {
  id: string;
  name: string;
  code: string;
}

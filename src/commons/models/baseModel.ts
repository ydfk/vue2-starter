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

export interface TreeItemModel {
  id: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  name: string | Function;
  children?: TreeItemModel[];
  parentId?: string;
  selectable?: boolean;
  isEnable?: boolean;
  isLeaf?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  nameAndBtn?: string | Function;
  canEdit?: boolean;
  fullPathArr?: string[];
  parentIsEnable?: boolean;
  [key: string]: any;
}

export interface UploadFileModel {
  id: string; //文件id
  name: string; // 文件名
  size: number; // 文件大小
  type: string; // 文件mime类型
  status: "done" | "uploading" | "error" | "removed";
  extension: string;
  percent?: number; //百分比
  response?: any; // 服务端响应内容
  linkProps?: Record<string, unknown>; // 下载链接额外的 HTML 属性
  lastModified?: number;
  lastModifiedDate?: Date;
  originFileObj?: File;
  ossObjectKey?: string;
}

export interface UploadRequestModel {
  action: string;
  file: UploadFileModel;
  filename: string;
  onError: (event: any, body?: Record<string, unknown>) => void;
  onProgress: (event: { percent: number | string }) => void;
  onSuccess: (body: Record<string, unknown>) => void;
  withCredentials: boolean;
  headers: any;
  data: any;
}

export interface PagedResult<T> {
  totalCount: number;
  pageResults: Array<T>;
}

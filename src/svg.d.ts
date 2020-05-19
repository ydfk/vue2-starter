/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qingyin.Web
 * FileName : svg.d.ts
 * Author : lyh67
 * Date : 2020-03-17 11:33:06
 */

declare module "*.svg" {
  import Vue, { VueConstructor } from "vue";
  const content: VueConstructor<Vue>;
  export default content;
}

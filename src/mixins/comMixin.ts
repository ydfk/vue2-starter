/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : comMixin.ts
 * Author : liyuhang
 * Date : 2020-02-28 17:05:19
 */

import { Component, Vue } from "vue-property-decorator";
import { Action } from "vuex-class";
import { A_LOADED, A_LOADING } from "@/store/store.types";

@Component
export default class ComMixin extends Vue {
  @Action(A_LOADING) showLoading: any;
  @Action(A_LOADED) hideLoading: any;
}

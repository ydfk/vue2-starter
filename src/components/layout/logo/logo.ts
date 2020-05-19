/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : logo.ts
 * Author : liyuhang
 * Date : 2020-02-28 22:34:09
 */

import { Vue, Component, Mixins, Prop } from "vue-property-decorator";
import { ROUTER_HOME, SYSTEM_NAME } from "@/commons/constants";
import ComMixin from "@/mixins/comMixin";

@Component
export default class Logo extends Mixins(ComMixin) {
  @Prop({ default: true, type: Boolean }) readonly canClick!: boolean;
  systemName = SYSTEM_NAME;

  onLogoClick() {
    if (this.canClick) {
      this.$router.push(ROUTER_HOME);
    }
  }
}

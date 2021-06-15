/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qingyin.Web
 * FileName : header.ts
 * Author : lyh67
 * Date : 2020-03-16 14:43:53
 */

import { Component, Watch, Mixins } from "vue-property-decorator";
import { Route } from "vue-router";
import { routeToArray } from "@/commons/method";
import ComMixin from "@/mixins/comMixin";
import { Action, Getter } from "vuex-class";
import { A_USER_SIGNOUT, G_USER } from "@/store/store.types";
import { UserModel } from "@/commons/models/loginModel";
import Logo from "@/components/layout/logo/logo.vue";
import { openConfirmModal } from "../dialog/dialogCommon";
import { RouterEnum } from "@/commons/enums";

@Component({
  components: {
    Logo,
  },
})
export default class Header extends Mixins(ComMixin) {
  showModifyPassword = false;

  menuKeys: string[] = [];
  menuOpenKeysKeys: string[] = [];

  router_home = RouterEnum.example;

  get showUser() {
    return this.user.name != "";
  }

  created() {
    if (this.menuKeys.length == 0) {
      this.menuKeys = [RouterEnum.home];
    }
  }

  @Watch("$route", { immediate: true, deep: true })
  routeChange(to: Route, from: Route) {
    if (to.path) {
      this.menuKeys = routeToArray(to.path).routeArr;
      const open = [...this.menuKeys];
      open.pop();
    }
  }

  onUserNameMenuClick(params: { item: any; key: string; keyPath: string[] }) {
    switch (params.key) {
      case "0":
        openConfirmModal("退出登录", "您确认要退出登录吗？", () => {
          this.singOut();
          this.$router.replace(RouterEnum.login);
          this.$message.success("您已成功退出！");
        });
        break;
      default:
        break;
    }
  }

  onMenuClick(params: { key: string }) {
    console.log(params.key);
    this.$router.push({ name: params.key });
  }

  onMenuOpenChange(openKeys: Array<string>) {
    this.menuOpenKeysKeys = openKeys;
  }

  oncloseModifyPassword() {
    this.showModifyPassword = false;
  }

  onLogoClick() {
    this.$router.push(RouterEnum.home);
  }

  @Getter(G_USER) user!: UserModel;
  @Action(A_USER_SIGNOUT) singOut!: any;
}

/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qingyin.Web
 * FileName : error.ts
 * Author : liyuhang
 * Date : 2020-03-07 10:37:46
 */

import { Vue, Component, Mixins } from "vue-property-decorator";
import { A_LOADED, G_USER } from "@/store/store.types";
import { Action, Getter } from "vuex-class";
import { ROUTER_LOGIN } from "@/commons/constants";
import { UserModel } from "@/commons/models";
import ComMixin from "@/mixins/comMixin";
import errorSvg from "@/assets/images/500.svg";

@Component({
  components: {
    errorSvg,
  },
})
export default class Error extends Mixins(ComMixin) {
  desc = "";

  created() {
    this.desc = this.$route.params.msg || "";
    this.hideLoading();
  }

  onHandleToHome() {
    this.$router.replace(ROUTER_LOGIN);
  }

  @Action(A_LOADED) hideLoading: any;
  @Getter(G_USER) user!: UserModel;
}

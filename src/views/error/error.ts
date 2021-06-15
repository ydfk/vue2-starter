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
import { UserModel } from "@/commons/models/loginModel";
import ComMixin from "@/mixins/comMixin";
import errorSvg from "@/assets/images/500.svg";
import { RouterEnum } from "@/commons/enums";

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
    this.$router.replace(RouterEnum.login);
  }

  @Getter(G_USER) user!: UserModel;
}

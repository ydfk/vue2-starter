/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : login.ts
 * Author : liyuhang
 * Date : 2020-02-29 16:38:28
 */

import { Component, Mixins } from "vue-property-decorator";
import FormMixin from "@/mixins/formMixin";
import { apiLogin } from "@/apis/apis";
import ComMixin from "@/mixins/comMixin";
import { Action, Getter } from "vuex-class";
import { A_USER_SIGN, A_USER_SIGNOUT } from "@/store/store.types";
import { TokenModel, UserModel } from "@/commons/models";
import { Logo, Footer } from "@/components/index";
import { FORM_LOGIN, INPUT_MAX_LENGTH_15, INPUT_MAX_LENGTH_30, REGEX_NO_SPACE, ROUTER_HOME, RULE_NO_SPACE } from "@/commons/constants";

@Component({
  components: {
    Logo,
    Footer,
  },
})
export default class Login extends Mixins(FormMixin, ComMixin) {
  loading = false;
  showRegistration = false;
  showRetrievePassword = false;

  formRef = FORM_LOGIN;
  loginForm = {
    code: "",
    password: "",
  };

  rules = {
    code: [this.getRequireRule("请输入手机号"), this.getMaxRule(INPUT_MAX_LENGTH_15), RULE_NO_SPACE],
    password: [this.getRequireRule("请输入密码"), this.getMaxRule(INPUT_MAX_LENGTH_30), RULE_NO_SPACE],
  };

  mounted() {
    window.onkeyup = (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        this.onSubmit();
      }
    };
    this.userSignOut();
    this.hideLoading();
  }

  onSubmit() {
    this.form(this.formRef).validate(async (valid) => {
      if (valid) {
        this.loading = true;
        const apiReturn = await apiLogin(this.loginForm.code, this.loginForm.password);
        this.loading = false;

        if (apiReturn.result) {
          await this.userSign(apiReturn.data);
          this.openSuccessMsg("登录成功");
          await this.$router.push(ROUTER_HOME);
        } else {
          this.openErrorMsg(`登录失败！${apiReturn.msg}`);
          this.form(this.formRef).resetFields();
        }
      }
    });
  }

  onForget() {
    this.showRetrievePassword = true;
  }

  onRegister() {
    this.showRegistration = true;
  }

  onRegisterCancel() {
    this.showRegistration = false;
  }

  onRetrievePasswordCancel() {
    this.showRetrievePassword = false;
  }

  onBackToHome() {
    this.$router.push("/");
  }

  @Action(A_USER_SIGNOUT) userSignOut!: () => {};
  @Action(A_USER_SIGN) userSign!: (tokenModel: TokenModel | undefined) => {};
}

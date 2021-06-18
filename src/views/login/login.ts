/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : login.ts
 * Author : liyuhang
 * Date : 2020-02-29 16:38:28
 */

import { defineComponent, reactive, toRefs } from "@vue/composition-api";
import Logo from "@/componentsBusiness/logo/logo";
import Footer from "@/componentsBusiness/footer/footer";
import { getMaxLengthRule, getRequireRule } from "@/commons/validate";
import { INPUT_MAX_LENGTH_15, INPUT_MAX_LENGTH_30, RULE_NO_SPACE } from "@/commons/constants";
import useAntdFormModel from "@/hooks/useAntdFormModel";
import { FormEnum, RouterEnum } from "@/commons/enums";
import useEnterKeyupEvent from "@/hooks/useEnterKeyupEvent";
import useRouter from "@/hooks/useRouter";
import { apiLogin } from "@/apis/loginApis";
import { openErrorMsg, openSuccessMsg } from "@/components/dialog/dialogCommon";
import { A_USER_SIGN } from "@/store/store.types";
import useVuex from "@/hooks/useVuex";

type loginFormType = {
  code: string;
  password: string;
};

export default defineComponent({
  components: { Logo, Footer },
  setup() {
    const state = reactive({
      loading: false,
      showRegistration: false,
      showRetrievePassword: false,
      rules: {
        code: [getRequireRule("请输入手机号"), getMaxLengthRule(INPUT_MAX_LENGTH_15), RULE_NO_SPACE],
        password: [getRequireRule("请输入密码"), getMaxLengthRule(INPUT_MAX_LENGTH_30), RULE_NO_SPACE],
      },
      loginModel: reactive<loginFormType>({
        code: "",
        password: "",
      }),
    });

    const { useAction } = useVuex();

    const { pushName } = useRouter();

    const loginForm = useAntdFormModel(FormEnum.login);
    const onSubmit = () => {
      loginForm.form().validate(async (valid) => {
        if (valid) {
          state.loading = true;
          const apiReturn = await apiLogin(state.loginModel.code, state.loginModel.password);
          state.loading = false;

          if (apiReturn.result) {
            await useAction(A_USER_SIGN, apiReturn.data);
            openSuccessMsg("登录成功");
            //await router.push({ name: RouterEnum.example });
            await pushName(RouterEnum.example);
          } else {
            openErrorMsg(`登录失败！${apiReturn.msg}`);
            loginForm.form().resetFields();
          }
        }
      });
    };

    //注册回车事件
    useEnterKeyupEvent(onSubmit);

    return {
      ...toRefs(state),
      ...loginForm,
      formRef: FormEnum.login,
      onSubmit: onSubmit,
      onForget: () => (state.showRetrievePassword = true),
      onRetrievePasswordCancel: () => (state.showRegistration = false),
      onRegister: () => (state.showRegistration = true),
      onRegisterCancel: () => (state.showRegistration = false),
    };
  },
});

/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : logo.tsx
 * Author : lyh67
 * Date : 2021-06-18 09:15:36
 */

import { defineComponent } from "@vue/composition-api";
import useRouter from "@/hooks/useRouter";
import { RouterEnum } from "@/commons/enums";
import { SYSTEM_NAME } from "@/commons/constants";
import "./logo.sass";

export default defineComponent({
  props: { canClick: { default: true, type: Boolean } },
  setup(props) {
    const onLogoClick = () => {
      if (props.canClick) {
        useRouter().pushName(RouterEnum.home);
      }
    };
    return () => (
      <div class="logo" vOn:Click={onLogoClick}>
        <img class="logoImg" src={require("../../assets/images/logo.png")} />
        <span class="systemName">{SYSTEM_NAME}</span>
      </div>
    );
  },
});

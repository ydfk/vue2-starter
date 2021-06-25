/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : header.tsx
 * Author : lyh67
 * Date : 2021-06-18 11:16:41
 */

import { computed, defineComponent, reactive } from "@vue/composition-api";
import Logo from "@/componentsBusiness/logo/logo";
import Menu from "@/componentsBusiness/menu/menu";
import { A_USER_SIGNOUT, G_MENU_SHOW_TOP, G_USER } from "@/store/store.types";
import { UserModel } from "@/commons/models/loginModel";
import { openConfirmModal, openSuccessMsg } from "@/components/dialog/dialogCommon";
import { RouterEnum } from "@/commons/enums";
import useRouter from "@/hooks/useRouter";
import useVuex from "@/hooks/useVuex";
import "./header.sass";

export default defineComponent({
  components: { Logo, Menu },
  setup() {
    const { useGetter, useAction } = useVuex();
    const { router } = useRouter();

    const state = reactive({
      user: computed(() => useGetter<UserModel>(G_USER)),
      showMenu: computed(() => useGetter(G_MENU_SHOW_TOP)),
    });

    const onUserNameMenuClick = (params: { item: any; key: string; keyPath: string[] }) => {
      switch (params.key) {
        case "0":
          openConfirmModal("退出登录", "您确认要退出登录吗？", () => {
            useAction(A_USER_SIGNOUT);
            router.replace(RouterEnum.login);
            openSuccessMsg("您已成功退出！");
          });
          break;
        default:
          break;
      }
    };

    return () => (
      <a-layout-header class="header">
        <a-row type="flex" justify="space-between" align="middle">
          <a-col span={4}>
            <Logo />
          </a-col>
          <a-col span={16}>{state.showMenu && <Menu />}</a-col>
          <a-col span={4} class="userName">
            <a-dropdown trigger={["click", "hover"]}>
              <span class="ant-dropdown-link">
                <a-icon type="user" />
                <span class="name">&nbsp;&nbsp;{state.user.name}&nbsp;&nbsp;</span>
                <a-icon type="down" />
              </span>
              <a-menu slot="overlay" vOn:click={onUserNameMenuClick}>
                <a-menu-item class="logout" key="0">
                  <a-icon type="logout" />
                  <span>退出登录</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-col>
        </a-row>
      </a-layout-header>
    );
  },
});

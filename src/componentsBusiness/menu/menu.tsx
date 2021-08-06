/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : menu.tsx
 * Author : lyh67
 * Date : 2021-06-18 16:28:36
 */

import { defineComponent, PropType, reactive, ref, watch } from "@vue/composition-api";
import useRouter from "@/hooks/useRouter";
import { menuRouters } from "@/router";
import { RouterItemModel } from "@/commons/models/baseModel";
import { RouterEnum } from "@/commons/enums";
import { routeToArray } from "@/commons/method";

type MenuModeType = "vertical" | "horizontal" | "vertical-right" | "inline";

export default defineComponent({
  components: {},
  props: {
    mode: { type: String as PropType<MenuModeType>, default: "horizontal" },
    theme: { type: String, default: "light" },
  },
  setup(props, { root }) {
    const state = reactive({
      openKeys: ref<string[]>([]),
      keys: ref<string[]>([]),
    });

    const { pushName } = useRouter();

    const onOpenChange = (openKeys: Array<string>) => (state.openKeys = openKeys);
    const onClick = (params: { key: RouterEnum }) => pushName(params.key);

    watch(
      () => root.$route,
      (to) => {
        if (to.path) {
          state.keys = routeToArray(to.path, to.meta).routeArr;
          const open = [...state.keys];
          open.pop();

          if (open && props.mode === "inline") {
            state.openKeys = open;
          }
        }
      },
      {
        immediate: true,
        //deep: true,
      }
    );

    const renderMenu = (menus: RouterItemModel[]) =>
      menus.map((menu) => {
        const title = (menu.meta && menu.meta.title) || "";
        const icon = (menu.meta && menu.meta.icon) || "";

        if (!menu.children || menu.children.length == 0) {
          return (
            <a-menu-item key={`${menu.name}`} title={title}>
              {icon ? <a-icon type={icon} /> : null}
              <span>{title}</span>
            </a-menu-item>
          );
        } else {
          return (
            <a-sub-menu key={menu.name}>
              <template slot="title">
                {icon ? <a-icon type={icon} /> : null}
                <span>{title}</span>
              </template>
              {renderMenu(menu.children)}
            </a-sub-menu>
          );
        }
      });

    return () => (
      <a-menu
        theme={props.theme}
        mode={props.mode}
        class="menuList"
        openKeys={state.openKeys}
        on-openChange={onOpenChange}
        selectedKeys={state.keys}
        on-click={onClick}>
        {renderMenu(menuRouters)}
      </a-menu>
    );
  },
});

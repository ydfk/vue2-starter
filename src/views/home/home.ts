/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : home.ts
 * Author : liyuhang
 * Date : 2020-02-29 18:41:27
 */

import Footer from "@/componentsBusiness/footer/footer";
import Header from "@/componentsBusiness/header/header";
import Sider from "@/componentsBusiness/sider/sider";
import { computed, defineComponent, reactive, toRefs } from "@vue/composition-api";
import useVuex from "@/hooks/useVuex";
import { G_MENU_SHOW_LEFT } from "@/store/store.types";

export default defineComponent({
  components: {
    Footer,
    Header,
    Sider,
  },
  setup() {
    const { useGetter } = useVuex();
    const state = reactive({
      showSider: computed(() => useGetter(G_MENU_SHOW_LEFT)),
    });

    return {
      ...toRefs(state),
    };
  },
});

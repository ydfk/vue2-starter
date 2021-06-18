/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : useVuex.ts
 * Author : lyh67
 * Date : 2021-06-18 10:24:31
 */

import { computed, getCurrentInstance, reactive } from "@vue/composition-api";

export default function UseVuex() {
  const vm = getCurrentInstance();

  if (vm == undefined) {
    throw "must use in setup!";
  }

  const state = reactive({
    store: computed(() => vm.proxy.$store),
  });

  return {
    store: state.store,
    useAction: (type: string, payload?: any) => state.store.dispatch(type, payload),
    useGetter: <T extends unknown>(type: string) => state.store.getters[type] as T,
  };
}

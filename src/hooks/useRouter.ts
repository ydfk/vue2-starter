/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : useRouter.ts
 * Author : lyh67
 * Date : 2021-06-18 09:23:06
 */
import { computed, getCurrentInstance, reactive } from "@vue/composition-api";
import { RouterEnum } from "@/commons/enums";

export default function useRouter() {
  const vm = getCurrentInstance();

  if (vm == undefined) {
    throw "must use in setup!";
  }

  const state = reactive({
    route: computed(() => vm.proxy.$route),
    router: computed(() => vm.proxy.$router),
  });

  const pushName = (routerName: RouterEnum) => state.router.push({ name: routerName });

  return { router: state.router, route: state.route, pushName };
}

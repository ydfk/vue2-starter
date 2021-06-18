/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-06-15 15:37:30
 * @LastEditors: ydfk
 * @LastEditTime: 2021-06-15 15:37:41
 */
import { BusEnum } from "@/commons/enums";
import { onMounted, onBeforeUnmount, getCurrentInstance, reactive, computed } from "@vue/composition-api";

export default () => {
  const vm = getCurrentInstance();

  if (vm == undefined) {
    throw "must use in setup!";
  }

  const state = reactive({
    bus: computed(() => vm.proxy.$bus),
  });

  const register = (busName: BusEnum, func: (...any) => any) => {
    onMounted(() => state.bus.on(busName, func));
    onBeforeUnmount(() => state.bus.off(busName, func));
  };

  const emit = (bus: BusEnum, ...args: any[]) => state.bus.emit(bus, ...args);

  return {
    bus: state.bus,
    registerBus: register,
    emitBus: emit,
  };
};

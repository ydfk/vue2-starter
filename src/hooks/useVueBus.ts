/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-06-15 15:37:30
 * @LastEditors: ydfk
 * @LastEditTime: 2021-06-15 15:37:41
 */
import { BusEnum } from "@/commons/enums";
import { onMounted, onBeforeUnmount } from "@vue/composition-api";
import { VueBus } from "vue-bus";

export default (bus: VueBus, busName: BusEnum, func: (...any) => any) => {
  onMounted(() => bus.on(busName, func));
  onBeforeUnmount(() => bus.off(busName, func));
};

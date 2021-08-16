/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-08-16 10:18:47
 * @LastEditors: ydfk
 * @LastEditTime: 2021-08-16 10:23:22
 */

import { onMounted, onBeforeUnmount } from "@vue/composition-api";

export default (event: string, func: (e: Event) => void) => {
  onMounted(() => window.addEventListener(event, func));
  onBeforeUnmount(() => window.removeEventListener(event, func));
};

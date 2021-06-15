/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-06-15 15:36:24
 * @LastEditors: ydfk
 * @LastEditTime: 2021-06-15 18:14:26
 */
import { onMounted, onBeforeUnmount } from "@vue/composition-api";

export default (func: () => void) => {
  const listener = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      func();
    }
  };

  onMounted(() => window.addEventListener("keyup", listener, false));
  onBeforeUnmount(() => window.removeEventListener("keyup", listener));
};

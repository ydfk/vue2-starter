/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-06-15 15:33:13
 * @LastEditors: ydfk
 * @LastEditTime: 2021-06-15 15:33:30
 */
import { computed, reactive, ref, toRefs } from "@vue/composition-api";
import { FormModel } from "ant-design-vue";

export default (formRefName: string) => {
  const state = reactive({
    [formRefName]: ref<FormModel>(),
  });

  return {
    ...toRefs(state),
    form: () => state[formRefName] as FormModel,
  };
};

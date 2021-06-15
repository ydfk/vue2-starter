/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : example.ts
 * Author : lyh67
 * Date : 2021-06-15 16:48:51
 */

import { defineComponent, reactive, toRefs } from "@vue/composition-api";
import Card from "@/components/card/card";
import DatePicker from "@/components/datePicker/datePicker";

export default defineComponent({
  components: { Card, DatePicker },
  props: {},
  setup(props) {
    const state = reactive({});
    return {
      ...toRefs(state),
    };
  },
});

/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : sider.tsx
 * Author : lyh67
 * Date : 2021-06-18 13:43:04
 */

import { defineComponent, reactive } from "@vue/composition-api";

export default defineComponent({
  props: {
    width: { type: [Number, String], default: 120 },
  },
  setup(props) {
    const state = reactive({});
    return () => (
      <div class="sider">
        <a-layout-sider width={props.width}></a-layout-sider>
      </div>
    );
  },
});

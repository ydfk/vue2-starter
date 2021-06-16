/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : tag.tsx
 * Author : liyuhang
 * Date : 2021-06-16 21:10:19
 */

import { defineComponent, reactive } from "@vue/composition-api";

export default defineComponent({
  props: {
    closable: { type: Boolean, default: false },
    color: { type: String, default: "#3f90ff" },
  },
  setup(props, { emit, slots }) {
    return () => (
      <span class="q-tags">
        <a-tag
          style={{
            padding: "4px 8px",
            marginBottom: "10px",
            fontsize: "13px",
          }}
          closable={props.closable}
          color={props.color}
          onClose={() => {
            emit("close");
          }}
        >
          {(slots.default && slots.default()) || []}
        </a-tag>
      </span>
    );
  },
});

/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : card.ts
 * Author : lyh67
 * Date : 2021-06-15 15:46:59
 */

import { defineComponent, reactive, toRefs, h } from "@vue/composition-api";
import "./card.sass";

export default defineComponent({
  name: "Card",
  props: {
    title: { type: String, default: "" },
    loading: { type: Boolean, default: false },
    bordered: { type: Boolean, default: true },
    hoverable: { type: Boolean, default: false },
    bodyStyle: {
      type: Object,
      default: () => {
        return {
          padding: "10px 15px",
        };
      },
    },
    headStyle: {
      type: Object,
      default: () => {
        return {
          padding: "0 10px",
          "min-height": "30px",
          "font-weight": "bold",
        };
      },
    },
  },
  setup(props) {},
});

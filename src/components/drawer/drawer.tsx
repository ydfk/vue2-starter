/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : drawer.tsx
 * Author : lyh67
 * Date : 2021-06-16 15:45:29
 */

import { defineComponent, reactive, watch } from "@vue/composition-api";

export default defineComponent({
  props: {
    title: { type: String, default: "" },
    width: { type: String, default: "75%" },
    maskClosable: { type: Boolean, default: true },
    showDrawer: { type: Boolean, default: true },
    afterVisibleChange: { type: Function },
    bodyStyle: {
      type: Object,
      default: () => {
        return {
          padding: "10px 15px",
        };
      },
    },
    wrapStyle: {
      type: Object,
      default: () => {
        return {
          marginTop: "60px",
          height: "93%",
        };
      },
    },
  },
  setup(props, { slots, emit }) {
    const state = reactive({
      visible: false,
      destroyOnClose: true,
    });

    watch(
      () => props.showDrawer,
      (val) => {
        state.visible = val;
      },
      { deep: true, immediate: true }
    );

    const onClose = () => {
      state.visible = false;
      emit("close");
    };

    return () => (
      <a-drawer
        title={props.title}
        width={props.width}
        visible={state.visible}
        body-style={props.bodyStyle}
        wrap-style={props.wrapStyle}
        closable={true}
        destroyOnClose={state.destroyOnClose}
        maskClosable={props.maskClosable}
        after-visible-change={props.afterVisibleChange}
        keyboard={true}
        vOn:close={onClose}>
        {(slots.default && slots.default()) || []}
      </a-drawer>
    );
  },
});

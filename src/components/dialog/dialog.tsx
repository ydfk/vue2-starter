/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-06-16 14:50:28
 * @LastEditors: ydfk
 * @LastEditTime: 2021-07-28 16:26:22
 */

import { DIALOG_MAX_HEIGHT, DIALOG_MAX_WIDTH } from "@/commons/constants";
import { computed, defineComponent, onMounted, reactive } from "@vue/composition-api";

export default defineComponent({
  props: {
    visible: { type: Boolean, default: false, required: true },
    title: { type: String, default: "" },
    okText: { type: String, default: "确认" },
    cancelText: { type: String, default: "关闭" },
    okType: { type: String, default: "primary" },
    cancelType: { type: String, default: "default" },
    width: { type: Number, default: 600 },
    height: { type: Number, default: 0 },
    showOk: { type: Boolean, default: true },
    showCancel: { type: Boolean, default: true },
    okLoading: { type: Boolean, default: false },
    zIndex: { type: Number, default: 1000 },
    transitionName: { type: String, default: "zoom" },
    maskTransitionName: { type: String, default: "fade" },
    getContainer: { type: Function },
    fixMaxHeight: { type: Boolean, default: true },
    bodyStylePadding: { type: String, default: "10px 30px" },
    bodyStyle: { type: Object },
    dialogStyle: { type: Object },
  },
  setup(props, { slots, emit }) {
    const state = reactive({
      modalWidth: 0,
      modalHeight: 0,
      maxHeight: computed(() => document.body.clientHeight - 200),
      maxWidth: computed(() => document.body.clientWidth - 100),
      bodyStyle: computed(() => {
        if (props.bodyStyle) {
          return props.bodyStyle;
        } else {
          if (props.height) {
            return {
              height: `${state.modalHeight}px`,
              "max-height": `${props.fixMaxHeight ? state.maxHeight : state.modalHeight}px`,
              overflow: "auto",
              padding: props.bodyStylePadding,
            };
          } else {
            return { "max-height": `${state.maxHeight}px`, overflow: "auto", padding: props.bodyStylePadding };
          }
        }
      }),
      dialogStyle: computed(() => {
        return props.dialogStyle ? props.dialogStyle : { top: "0px" };
      }),
    });

    onMounted(() => {
      state.modalWidth = props.width == DIALOG_MAX_WIDTH ? state.maxWidth : props.width;
      state.modalHeight = props.height == DIALOG_MAX_HEIGHT ? state.maxHeight : props.height;
    });

    const onCancel = () => emit("cancel");
    const onOk = () => emit("ok");

    const ok = props.showOk && (
      <a-button key="submit" type={props.okType} loading={props.okLoading} vOn:click={onOk}>
        {props.okText}
      </a-button>
    );

    const cancel = props.showCancel && (
      <a-button key="cancel" type={props.cancelType} vOn:click={onCancel}>
        {props.cancelText}
      </a-button>
    );

    const footer = slots.footer || [ok, cancel];
    return () => (
      <a-modal
        title={props.title}
        visible={props.visible}
        destroyOnClose={true}
        keyboard={false}
        maskClosable={false}
        width={state.modalWidth}
        bodyStyle={state.bodyStyle}
        closable={props.showCancel}
        centered={true}
        zIndex={props.zIndex}
        dialog-style={state.dialogStyle}
        transitionName={props.transitionName}
        maskTransitionName={props.maskTransitionName}
        getContainer={props.getContainer}
        footer={footer}
        vOn:cancel={onCancel}
      >
        {(slots.default && slots.default()) || []}
      </a-modal>
    );
  },
});

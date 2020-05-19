/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : comMixin.ts
 * Author : liyuhang
 * Date : 2020-02-28 17:05:19
 */

import { Component, Vue, Watch } from "vue-property-decorator";
import { Modal } from "ant-design-vue";
import { Action, Getter, Mutation } from "vuex-class";
import { A_LOADED, A_LOADING } from "@/store/store.types";
import { DATE_FORMAT, DATE_FORMAT_NO_TIME } from "@/commons/constants";
import { toThousands } from "@/commons/method";

@Component
export default class ComMixin extends Vue {
  DATE_FORMAT = DATE_FORMAT;
  DATE_FORMAT_NO_TIME = DATE_FORMAT_NO_TIME;

  @Action(A_LOADING) showLoading: any;
  @Action(A_LOADED) hideLoading: any;

  openSuccessMsg(content: any, duration?: number, onClose?: () => void) {
    this.$message.success(content, duration, onClose);
  }

  openWarnMsg(content: any, duration?: number, onClose?: () => void) {
    this.$message.warning(content, duration, onClose);
  }

  openInfoMsg(content: any, duration?: number, onClose?: () => void) {
    this.$message.info(content, duration, onClose);
  }

  openErrorMsg(content: any, duration?: number, onClose?: () => void) {
    this.$message.error(content, duration, onClose);
  }

  openLoadingMsg(content: any, duration?: number, onClose?: () => void) {
    return this.$message.loading(content, duration, onClose);
  }

  openConfirmModal(title: string, content: string, onOk: () => void, onCancel?: () => void, okText = "确认", cancelText = "取消") {
    Modal.confirm({ title, content, onOk, onCancel, okText, cancelText, parentContext: this });
  }

  openDeleteModal(onOk: () => void, title = "删除", content = "您确认要删除吗？", onCancel?: () => void, okText = "确认", cancelText = "取消") {
    Modal.confirm({
      title,
      content,
      onOk,
      onCancel,
      okText,
      cancelText,
      okType: "danger",
      parentContext: this,
    });
  }

  openSuccessModal(title: string, content: string, onOk?: () => void, okText = "确认") {
    Modal.success({ title, content, onOk, okText, parentContext: this });
  }

  openWarnModal(title: string, content: string, onOk?: () => void, okText = "确认") {
    Modal.warning({ title, content, onOk, okText, parentContext: this });
  }

  openInfoModal(title: string, content: string, onOk?: () => void, okText = "确认") {
    Modal.info({ title, content, onOk, okText, parentContext: this });
  }

  openErrorModal(title: string, content: string, onOk?: () => void, okText = "确认") {
    Modal.error({ title, content, onOk, okText, parentContext: this });
  }

  toThousands(n: number): string {
    return toThousands(n);
  }
}

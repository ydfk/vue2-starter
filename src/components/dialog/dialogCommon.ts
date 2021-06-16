/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : dialogCommon.ts
 * Author : lyh67
 * Date : 2021-06-15 16:36:42
 */

import { Modal, message } from "ant-design-vue";

export const openDeleteModal = (
  onOk: () => void,
  title = "删除",
  content = "您确认要删除吗？",
  onCancel?: () => void,
  okText = "确认",
  cancelText = "取消"
) => {
  Modal.confirm({
    title,
    content,
    onOk,
    onCancel,
    okText,
    cancelText,
    okType: "danger",
  });
};

export const openConfirmModal = (title: string, content: string, onOk: () => void, onCancel?: () => void, okText = "确认", cancelText = "取消") => {
  Modal.confirm({ title, content, onOk, onCancel, okText, cancelText });
};

export const openSuccessModal = (title: string, content: string, onOk?: () => void, okText = "确认") => {
  Modal.success({ title, content, onOk, okText });
};

export const openWarnModal = (title: string, content: string, onOk?: () => void, okText = "确认") => {
  Modal.warning({ title, content, onOk, okText });
};

export const openInfoModal = (title: string, content: string, onOk?: () => void, okText = "确认") => {
  Modal.info({ title, content, onOk, okText });
};

export const openErrorModal = (title: string, content: string, onOk?: () => void, okText = "确认") => {
  Modal.error({ title, content, onOk, okText });
};

export const openSuccessMsg = (msg: string) => {
  message.success(msg);
};

export const openWarningMsg = (msg: string) => {
  message.warning(msg);
};

export const openWarnMsg = (msg: string) => {
  message.warn(msg);
};

export const openErrorMsg = (msg: string) => {
  message.error(msg);
};

export const openInfoMsg = (msg: string) => {
  message.info(msg);
};

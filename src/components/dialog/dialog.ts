/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : dialog.ts
 * Author : liyuhang
 * Date : 2020-03-03 16:47:53
 */

import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { DIALOG_MAX_HEIGHT, DIALOG_MAX_WIDTH } from "@/commons/constants";

@Component
export default class Dialog extends Vue {
  @Prop({ default: false, required: true, type: Boolean })
  readonly visible!: boolean;

  @Prop({ default: "", type: String }) readonly title!: string;
  @Prop({ default: "提交", type: String }) readonly okText!: string;
  @Prop({ default: "关闭", type: String }) readonly cancelText!: string;
  @Prop({ default: "primary", type: String }) readonly okType!: string;
  @Prop({ default: "default", type: String }) readonly cancelType!: string;
  @Prop({ default: 600, type: Number }) readonly width!: number;

  @Prop({ default: 0, type: Number }) readonly height!: number;
  @Prop({ default: true, type: Boolean }) readonly showOk!: boolean;
  @Prop({ default: true, type: Boolean }) readonly showCancel!: boolean;

  modalWidth = 0;
  modalHeight = 0;

  get maxHeight() {
    return document.body.clientHeight - 200;
  }

  get maxWidth() {
    return document.body.clientWidth - 100;
  }

  get bodyStyle(): object {
    if (this.height) {
      return { height: `${this.modalHeight}px`, "max-height": `${this.maxHeight}px`, overflow: "auto" };
    } else {
      return { "max-height": `${this.maxHeight}px`, overflow: "auto" };
    }
  }

  created() {
    this.modalWidth = this.width === DIALOG_MAX_WIDTH ? this.maxWidth : this.width;
    this.modalHeight = this.height === DIALOG_MAX_HEIGHT ? this.maxHeight : this.height;
  }

  @Emit("cancel")
  onCancel() {}

  @Emit("ok")
  onOk() {}
}

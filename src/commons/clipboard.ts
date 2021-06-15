/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : clipboard.ts
 * Author : liyuhang
 * Date : 2020-03-05 20:54:16
 */

//定义函数

import { isIOS } from "@/commons/method";

let textArea: any;

//创建文本元素
const createTextArea = (text: string) => {
  textArea = document.createElement("textArea");
  textArea.value = text;
  document.body.appendChild(textArea);
};

//选择内容
const selectText = () => {
  let range: any;
  let selection: any;

  if (isIOS()) {
    selection = window.getSelection();
    selection.removeAllRanges();
    range = document.createRange();
    range.selectNodeContents(textArea);
    selection.addRange(range);
    textArea.setSelectionRange(0, 999999);
  } else {
    textArea.select();
  }
};

//复制到剪贴板
export const copyToClipboard = (text: string) =>
  new Promise<void>((resolve, reject) => {
    try {
      createTextArea(text);
      selectText();
      if (document.execCommand("Copy")) {
        resolve();
      } else {
        reject();
      }
    } catch (err) {
      reject(err);
    }
    document.body.removeChild(textArea);
  });

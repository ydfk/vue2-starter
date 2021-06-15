import axios from "@/apis/axios";
import { REGEX_CHINESE, REGEX_NO_SPACE, REGEX_AROUND_NO_SPACE } from "./constants";

/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-06-15 15:22:29
 * @LastEditors: ydfk
 * @LastEditTime: 2021-06-15 15:26:23
 */
function remote(rule, value, callback) {
  const url: string = rule.url;
  if (url === undefined || url === null || url.trim() === "") {
    callback("remote validator url is null");
    throw new Error("remote validator url is null");
  }

  if (!value) {
    callback();
  }

  let message: string = rule.message;
  if (message) {
    message = rule.message;
  } else {
    message = `'${value}'已存在`;
  }

  if (rule.field) {
    rule.data[rule.field] = value;
  }

  axios
    .post(url, rule.data)
    .then((result) => {
      if (result) {
        callback();
      } else {
        callback(message);
      }
    })
    .catch((err) => {
      callback(err);
    });
}

function nonChinese(rule, value, callback) {
  if (!value) {
    callback();
  }

  let message: string = rule.message;
  if (message) {
    message = rule.message;
  } else {
    message = `不能输入中文字符`;
  }

  const regExp = new RegExp(REGEX_CHINESE);
  if (regExp.test(value)) {
    callback(message);
  } else {
    callback();
  }
}

function nonSpace(rule, value, callback) {
  let message: string = rule.message;
  if (message) {
    message = rule.message;
  } else {
    message = `不能输入空格`;
  }

  const regExp = new RegExp(REGEX_NO_SPACE);

  if (regExp.test(value)) {
    callback();
  } else {
    callback(message);
  }
}

function whitespace(rule, value, callback) {
  let message: string = rule.message;
  if (message) {
    message = rule.message;
  } else {
    message = `不能输入空格`;
  }

  const regExp = new RegExp(REGEX_AROUND_NO_SPACE);

  if (regExp.test(value)) {
    callback();
  } else {
    callback(message);
  }
}

function emptyArray(rule, value, callback) {
  let message: string = rule.message;

  if (message) {
    message = rule.message;
  } else {
    message = `值不能为空`;
  }

  if (value != null && value.length != 0) {
    callback();
  } else {
    callback(message);
  }
}

function numberMin(rule, value, callback) {
  let message: string = rule.message;

  const min = (rule.data as number) || 0;

  if (message) {
    message = rule.message;
  } else {
    message = `值不能小于${min}`;
  }

  if (value >= min) {
    callback();
  } else {
    callback(message);
  }
}

function isMobile(rule, value, callback) {
  let message: string = rule.message;
  if (message) {
    message = rule.message;
  } else {
    message = "请填写正确的手机号码";
  }
  const regExpression = /^(86)?((13\d{9})|(15[0,1,2,3,5,6,7,8,9]\d{8})|(18[0,5,6,7,8,9]\d{8}))$/;
  if (regExpression.test(value)) {
    callback();
  } else {
    callback(message);
  }
}

export function getMaxLengthRule(maxLength: number, msg?: string) {
  return { max: maxLength, message: msg || `长度不能超过${maxLength}位` };
}

export function getMinLengthRule(minLength: number, msg?: string) {
  return { min: minLength, message: msg || `长度不能小于${minLength}位`, trigger: "blur" };
}

export function getRequireRule(msg: string) {
  return { required: true, message: msg };
}

export function getRequireRuleAndNotSpace(msg: string) {
  return { required: true, message: msg, whitespace: true };
}

export function getNonChineseRule(msg?: string) {
  return { validator: nonChinese, message: msg, trigger: "blur" };
}

export function getNonSpaceRule(msg?: string) {
  return { validator: nonSpace, message: msg, trigger: "blur" };
}

export function getWhitespaceRule(msg?: string) {
  return { validator: whitespace, message: msg };
}

export function getEmptyArrayRule(msg?: string) {
  return { validator: emptyArray, message: msg };
}

export function getNumberMinRule(min: number, msg?: string) {
  return { validator: numberMin, data: min, message: msg || `值不能小于${min}` };
}

export function getRemoteRule(url: string, data: any, msg?: string) {
  return { validator: remote, url: url, data: data, message: msg, trigger: "blur" };
}

export function getIsMobile(msg?: string) {
  return { validator: isMobile, message: msg, trigger: "blur" };
}

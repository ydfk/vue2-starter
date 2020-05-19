/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : method.ts
 * Author : liyuhang
 * Date : 2020-02-29 17:57:27
 */

import { DATE_FORMAT, DATE_FORMAT_NO_TIME } from "@/commons/constants";
import moment from "moment";

export const routeToArray = (route: string): { routeArr: string[]; params: string } => {
  if (!route) {
    return {
      routeArr: [],
      params: "",
    };
  }
  const arr: string[] = route.split("/");
  const ret: string[] = [];
  let params = "";
  arr.shift();
  arr.forEach((item) => {
    if (parseInt(item, 10)) {
      params = item;
      return;
    }
    ret.push(item);
    // ret.push(index ? item : `/${item}`);
  });

  return {
    routeArr: ret,
    params,
  };
};

export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
};

export const isMobile = () => {
  const isMobile = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
  return isMobile || isIOS();
};

export const getBrowser = () => {
  const userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  const isOpera = userAgent.indexOf("Opera") > -1;

  if (userAgent.indexOf("DingTalk") > -1) {
    //用钉钉打开
    return "dingtalk";
  }
  if (userAgent.toLowerCase().indexOf("micromessenger") > -1) {
    //用微信打开
    return "weixin";
  }

  if (isOpera) {
    return "Opera";
  } //判断是否Opera浏览器
  if (userAgent.indexOf("Firefox") > -1) {
    return "Firefox";
  } //判断是否Firefox浏览器
  if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  }
  if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  } //判断是否Safari浏览器
  if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
    return "IE";
  } //判断是否IE浏览器
};

export const getUrlWithOutParams = (urlWithParams: string | undefined): string => {
  if (urlWithParams) {
    if (urlWithParams.indexOf("?") > -1) {
      return urlWithParams.split("?")[0];
    } else {
      return urlWithParams;
    }
  } else {
    return "";
  }
};

const randStr = () => Math.random().toString(36).substr(2);

const getRandomStrAndLength = (str: string, len: number): string => {
  if (str.length >= len) {
    return str.substr(0, len);
  } else if (str.length < len) {
    return getRandomStrAndLength(str + randStr(), len);
  } else {
    return str;
  }
};

export const getRandomStr = (len: number): string => {
  const str = randStr();
  return getRandomStrAndLength(str, len);
};

export const convertBooleanToStr = (val: boolean) => (val ? "是" : "否");

export const formatDateTime = (date: Date, format?: string) => {
  format = format || DATE_FORMAT;
  const dateFormat = moment(date).format(format);
  if (dateFormat.indexOf("0001-01-01") > -1 || dateFormat.indexOf("1970-01-01") > -1) {
    return "";
  } else {
    return dateFormat;
  }
};

export const toThousands = (num: number, n = 2, symbol = ","): string => {
  if (num != undefined) {
    if (n < 0) {
      throw new Error("参数n不应该小于0");
    }

    const hasDot = `${num}`.indexOf(".") != -1; //这里检测num是否为小数，true表示小数
    const m = n != undefined ? n : 1;

    let result = m == 0 ? num.toFixed(m) + "." : hasDot ? (n ? num.toFixed(n) : num) : num.toFixed(m);

    result = result.toString().replace(/(\d)(?=(\d{3})+\.)/g, function (match, p1, p2) {
      return p1 + symbol;
    });

    if (n == 0 || (!hasDot && !n)) {
      //如果n为0或者传入的num是整数并且没有指定整数的保留位数，则去掉前面操作中的小数位
      result = result.substring(0, result.indexOf("."));
    }

    return result;
  } else {
    return "";
  }
};

export const isMinDate = (date: Date | undefined): boolean => {
  const str = moment(date).format(DATE_FORMAT_NO_TIME);
  return str.indexOf("0001-01-01") > -1 || str.indexOf("1970-01-01") > -1;
};

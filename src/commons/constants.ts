/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : constants.ts
 * Author : liyuhang
 * Date : 2020-02-28 16:53:48
 */
export const SYSTEM_NAME = "TEC前端框架";

export const TOKEN_REFRESH = 300; //// token滑动刷新时间 单位为秒 用户活跃则 刷新token时间

export const TOKEN_EXPIRE_MSG = "长时间未操作，请重新登录";

export const TIP_PASSWORD = "只能包含大小写字母、数字和特殊符号!@#$%^&*/\\_-.";
export const REGEX_PASSWORD = "^[0-9|a-z|A-Z|!@#$%\\^&*/\\\\_-|.]{6,16}$"; // 密码正则表达式
export const REGEX_NO_SPACE = "^[^\\s]*$"; // 禁止空格
export const REGEX_AROUND_NO_SPACE = /^\S.*\S$|(^\S{0,1}\S$)/; // 禁止空格
export const REGEX_MOBILE = /^1[3456789]\d{9}$/;
export const REGEX_CHINESE = "[\u4E00-\u9FA5]"; // 中文

export const INPUT_MAX_LENGTH_15 = 15; // 文本框最大输入长度15
export const INPUT_MAX_LENGTH_30 = 30; // 文本框最大输入长度30
export const INPUT_MAX_LENGTH_100 = 100; // 文本框最大输入长度100
export const INPUT_MAX_LENGTH = 50; // 文本框最大输入长度
export const DIALOG_MAX_HEIGHT = 580;
export const DIALOG_MAX_WIDTH = 1300;
export const DIALOG_MIN_HEIGHT = 210;
export const DIALOG_MIN_WIDTH = 600;

export const NO_LOGIN = "NO_LOGIN"; // 尚未登录系统
export const NO_TOKEN = "NO_TOKEN"; // TOKEN过期

export const TABLE_PAGE_SIZE = 10; // 默认每页数量
export const TABLE_RECORD_KEY = "RecordKey";
export const TABLE_ACTION_KEY = "actionKey";
export const TABLE_DESC_ORDER_KEY = "UpdateAt";
export const TABLE_TAGS_COUNT = 5;

export const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
export const DATE_FORMAT_NO_SECOND = "YYYY-MM-DD HH:mm";
export const DATE_FORMAT_NO_TIME = "YYYY-MM-DD";
export const DATE_FORMAT_NO_TIME_ZH = "YYYY年MM月DD日";
export const DATE_FORMAT_NO_SECOND_ZH = "YYYY年MM月DD日 HH:mm";

export const NUMBER_FORMAT_N2 = "0,0.00";
export const NUMBER_FORMAT_N = "0,0";
export const INPUT_NUMBER_MAX = 9999999999999; //数字框最大值
export const INPUT_NUMBER_MIN = 0; // 数字框最小值
export const INPUT_NUMBER_STEP = 0.01; // 步进

export const FORM_LOGIN = "FORM_LOGIN";

export const RULE_NO_SPACE = { pattern: REGEX_NO_SPACE, message: `禁止输入空格` };

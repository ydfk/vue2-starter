/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : formMixin.ts
 * Author : liyuhang
 * Date : 2020-02-29 20:24:29
 */
import { Component, Vue } from "vue-property-decorator";
import {
  TIP_PASSWORD,
  REGEX_PASSWORD,
  REGEX_NO_SPACE,
  INPUT_MAX_LENGTH_15,
  INPUT_MAX_LENGTH_30,
  INPUT_MAX_LENGTH,
  INPUT_NUMBER_MIN,
  INPUT_NUMBER_MAX,
  INPUT_MAX_LENGTH_100,
} from "@/commons/constants";
import { FormModel } from "ant-design-vue";

@Component
export default class FormMixin extends Vue {
  REGEX_NO_SPACE: string = REGEX_NO_SPACE;
  REGEX_PASSWORD: string = REGEX_PASSWORD;
  TIP_PASSWORD: string = TIP_PASSWORD;

  INPUT_MAX_LENGTH_15: number = INPUT_MAX_LENGTH_15;
  INPUT_MAX_LENGTH_30: number = INPUT_MAX_LENGTH_30;
  INPUT_MAX_LENGTH_100 = INPUT_MAX_LENGTH_100;
  INPUT_MAX_LENGTH = INPUT_MAX_LENGTH;

  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  formItemLayoutOnPage = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 21 },
    },
  };

  formInputIntDefault = {
    min: INPUT_NUMBER_MIN,
    max: INPUT_NUMBER_MAX,
    step: 1,
    precision: 0,
    formatter: (value: number) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    parser: (value: string) => value.replace(/$s?|(,*)/g, ""),
  };

  form(refName: string) {
    return this.$refs[refName] as FormModel;
  }

  getMaxRule(maxLength: number, msg?: string) {
    return { max: maxLength, message: msg || `长度不能超过${maxLength}位` };
  }

  getRequireRule(msg: string) {
    return { required: true, message: msg };
  }
}

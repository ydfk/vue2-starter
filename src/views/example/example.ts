/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : example.ts
 * Author : lyh67
 * Date : 2021-06-15 16:48:51
 */

import { defineComponent, reactive, ref, toRefs, computed } from "@vue/composition-api";
import Card from "@/components/card/card";
import DatePicker from "@/components/datePicker/datePicker";
import DateRangePicker from "@/components/dateRangePicker/dateRangePicker";
import { openConfirmModal, openSuccessMsg, openWarningMsg } from "@/components/dialog/dialogCommon";
import moment from "moment";
import { DATE_FORMAT, FORM_LAYOUT } from "@/commons/constants";
import { datePickType } from "@/components/datePicker/datePickerType";
import Dialog from "@/components/dialog/dialog";
import Drawer from "@/components/drawer/drawer";
import { getRequireRule } from "@/commons/validate";
import useAntdFormModel from "@/hooks/useAntdFormModel";
import { FormEnum } from "@/commons/enums";
import InputNumber from "@/components/inputNumber/inputNumber";
import Select from "@/components/select/select";
import { ItemSourceModel } from "@/commons/models/baseModel";

type demoFormModel = {
  text: string;
  amount: number | undefined;
  type: string[] | undefined;
};

export default defineComponent({
  components: { Card, DatePicker, DateRangePicker, Dialog, Drawer, InputNumber, Select },
  setup() {
    const state = reactive({
      datePickerValue: ref<datePickType>(moment()),
      dateRangePickerValue: ref<datePickType[]>([moment("2021-1-1"), moment()]),
      typeData: reactive<ItemSourceModel[]>([
        {
          value: "1",
          text: "支付宝",
        },
        {
          value: "2",
          text: "微信",
        },
      ]),
      showDialog: false,
      showDrawer: false,
      showFormDetail: false,
      formRules: {
        text: [getRequireRule("必填")],
        amount: [getRequireRule("必填")],
        type: [getRequireRule("必选择")],
      },
      formModel: reactive<demoFormModel>({
        text: "",
        amount: undefined,
        type: undefined,
      }),
    });

    const demoForm = useAntdFormModel(FormEnum.demo);

    const onRestDatePicker = () => {
      state.datePickerValue = moment();
      state.dateRangePickerValue = [moment("2021-1-1"), moment()];
    };

    const showDatePickerValue = computed(() => moment(state.datePickerValue).format(DATE_FORMAT));
    const showDateRangePickerValue = computed(
      () => `${state.dateRangePickerValue[0]?.format(DATE_FORMAT)} 到 ${state.dateRangePickerValue[1]?.format(DATE_FORMAT)}`
    );

    const onOk = () => {
      demoForm.form().validate((valid) => {
        if (valid) {
          openSuccessMsg("转账成功");
          state.showDialog = false;
          state.showFormDetail = true;
        }
      });
    };

    return {
      ...toRefs(state),
      ...demoForm,
      formRef: FormEnum.demo,
      showDatePickerValue,
      showDateRangePickerValue,
      DATE_FORMAT,
      onRestDatePicker: onRestDatePicker,
      onOk: onOk,
      onOpenDialog: () => {
        state.showDialog = true;
        state.showFormDetail = false;
      },
    };
  },
});

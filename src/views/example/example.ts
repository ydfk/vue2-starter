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
import { DATE_FORMAT } from "@/commons/constants";
import { datePickType } from "@/components/datePicker/datePickerType";
import Dialog from "@/components/dialog/dialog";
import Drawer from "@/components/drawer/drawer";

export default defineComponent({
  components: { Card, DatePicker, DateRangePicker, Dialog, Drawer },
  setup() {
    const state = reactive({
      datePickerValue: ref<datePickType>(moment()),
      dateRangePickerValue: ref<datePickType[]>([moment("2021-1-1"), moment()]),
      showDialog: false,
      showDrawer: false,
    });

    const onRestDatePicker = () => {
      state.datePickerValue = moment();
      state.dateRangePickerValue = [moment("2021-1-1"), moment()];
    };

    const showDatePickerValue = computed(() => moment(state.datePickerValue).format(DATE_FORMAT));
    const showDateRangePickerValue = computed(
      () => `${state.dateRangePickerValue[0]?.format(DATE_FORMAT)} 到 ${state.dateRangePickerValue[1]?.format(DATE_FORMAT)}`
    );

    return {
      ...toRefs(state),
      showDatePickerValue,
      showDateRangePickerValue,
      DATE_FORMAT,
      onRestDatePicker: onRestDatePicker,
      onClick: () =>
        openConfirmModal(
          "点我干什么",
          "这只是一个例子",
          () => openSuccessMsg("确认"),
          () => openWarningMsg("取消")
        ),
    };
  },
});

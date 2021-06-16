/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : dateRangePicker.tsx
 * Author : lyh67
 * Date : 2021-06-15 16:21:41
 */

import { defineComponent, reactive, PropType, ref, watch } from "@vue/composition-api";
import { DATE_FORMAT_NO_TIME } from "@/commons/constants";
import moment from "moment";
import { datePickType } from "@/components/datePicker/datePickerType";

export default defineComponent({
  props: {
    placeholder: { type: String, default: "请选择时间段" },
    format: { type: String, default: DATE_FORMAT_NO_TIME },
    disabled: { type: Boolean, default: false },
    allowClear: { type: Boolean, default: false },
    showTime: { type: Boolean, default: false },
    value: { type: Array as PropType<datePickType[]> },
  },
  setup(props, { emit }) {
    const state = reactive({
      selectValue: ref<datePickType[] | null>(null),
    });
    watch(
      () => props.value,
      (val) => {
        if (val) {
          state.selectValue = [];
          if (val.length > 1) {
            state.selectValue = [moment(val[0]), moment(val[1])];
          } else if (val.length === 1) {
            state.selectValue = [moment(val[0]), null];
          }
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );

    const emitChange = (val: datePickType[] | null) => {
      emit("input", val);
      emit("change", val);
    };

    const change = (val: datePickType[]) => {
      if (val && val.length > 0) {
        emitChange(val);
      } else {
        emitChange(null);
      }
    };

    return () => (
      <a-range-picker
        allowClear={props.allowClear}
        showTime={props.showTime}
        //placeholder={props.placeholder}
        format={props.format}
        disabled={props.disabled}
        vModel={state.selectValue}
        vOn:change={change}
      />
    );
  },
});

/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : datePicker.tsx
 * Author : lyh67
 * Date : 2021-06-15 16:02:30
 */

import { DATE_FORMAT_NO_TIME } from "@/commons/constants";
import { defineComponent, PropType, reactive, ref, watch } from "@vue/composition-api";
import moment from "moment";
import { datePickType } from "./datePickerType";

export default defineComponent({
  props: {
    placeholder: { type: String, default: "请选择时间" },
    format: { type: String, default: DATE_FORMAT_NO_TIME },
    disabled: { type: Boolean, default: false },
    allowClear: { type: Boolean, default: false },
    showTime: { type: Boolean, default: false },
    value: { type: Object as PropType<datePickType> },
  },
  setup(props, { emit }) {
    const state = reactive({
      selectValue: ref<datePickType>(null),
    });
    watch(
      () => props.value,
      (val) => {
        if (val) {
          const temp = moment(val);
          if (state.selectValue === null || state.selectValue.toDate().getTime() !== temp.toDate().getTime()) {
            state.selectValue = temp;
          }
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );

    const onChange = (val: moment.Moment) => {
      emit("input", val);
      emit("change", val);
    };

    return () => (
      <a-date-picker
        allowClear={props.allowClear}
        placeholder={props.placeholder}
        format={props.format}
        showTime={props.showTime}
        disabled={props.disabled}
        v-model={state.selectValue}
        vOn:change={onChange}
      />
    );
  },
});

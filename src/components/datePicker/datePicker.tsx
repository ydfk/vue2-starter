/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : datePicker.tsx
 * Author : lyh67
 * Date : 2021-06-15 16:02:30
 */

import { DATE_FORMAT, DATE_FORMAT_NO_TIME } from "@/commons/constants";
import { formatDateTime } from "@/commons/method";
import { defineComponent, reactive, ref, toRefs, watch } from "@vue/composition-api";
import moment from "moment";

export default defineComponent({
  props: {
    placeholder: { type: String, default: "请选择时间" },
    format: { type: String, default: DATE_FORMAT_NO_TIME },
    disabled: { type: Boolean, default: false },
    value: { type: String },
  },
  setup(props, { emit }) {
    const selectValue = ref<moment.Moment | null>(null);

    watch(
      () => props.value,
      (val) => {
        if (val) {
          const temp = moment(val);
          if (selectValue.value === null || selectValue.value.toDate().getTime() !== temp.toDate().getTime()) {
            selectValue.value = temp;
          }
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );

    const change = (val: moment.Moment) => {
      const dateStr = formatDateTime(val.toDate(), DATE_FORMAT);
      emit("change", dateStr);
    };

    return () => (
      <div class="datePicker">
        <a-date-picker
          allowClear={false}
          placeholder={props.placeholder}
          format={props.format}
          disabled={props.disabled}
          vModel={selectValue}
          on-change={change}
        />
      </div>
    );
  },
});

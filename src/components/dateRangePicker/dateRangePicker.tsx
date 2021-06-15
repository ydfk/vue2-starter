/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : dateRangePicker.tsx
 * Author : lyh67
 * Date : 2021-06-15 16:21:41
 */

import { defineComponent, reactive, PropType, ref, watch } from "@vue/composition-api";
import { DATE_FORMAT, DATE_FORMAT_NO_TIME } from "@/commons/constants";
import moment from "moment";
import { formatDateTime } from "@/commons/method";

export default defineComponent({
  props: {
    placeholder: { type: String, default: "请选择时间" },
    format: { type: String, default: DATE_FORMAT_NO_TIME },
    disabled: { type: Boolean, default: false },
    isNeedHour: { type: Boolean, default: true },
    value: { type: Array as PropType<string[]> },
  },
  setup(props, { emit }) {
    const selectValue = ref<(moment.Moment | null)[] | null>(null);

    watch(
      () => props.value,
      (val) => {
        if (val) {
          selectValue.value = [];
          if (val.length > 1) {
            selectValue.value = [moment(val[0]), moment(val[1])];
          } else if (val.length === 1) {
            selectValue.value = [moment(val[0]), null];
          }
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );

    const change = (val: moment.Moment[]) => {
      if (val && val.length > 0) {
        if (props.isNeedHour) {
          const dateStr = val.map((x) => formatDateTime(x.toDate(), DATE_FORMAT));
          emit("change", dateStr);
        } else {
          const dateStr = val.map((x) => formatDateTime(x.toDate(), DATE_FORMAT_NO_TIME));
          emit("change", dateStr);
        }
      } else {
        emit("change", null);
      }
    };

    return () => (
      <div class="dateRangePicker">
        <a-range-picker
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

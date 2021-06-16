/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : inputNumber.tsx
 * Author : lyh67
 * Date : 2021-06-16 16:05:52
 */

import { INPUT_NUMBER_MAX, INPUT_NUMBER_MIN } from "@/commons/constants";
import { defineComponent, reactive, ref, watch } from "@vue/composition-api";

export default defineComponent({
  props: {
    value: { type: Number },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    isRequired: { type: Boolean, default: false },
    maxNumberValue: { default: INPUT_NUMBER_MAX, type: Number },
    minNumberValue: { default: INPUT_NUMBER_MIN, type: Number },
    step: { default: 1, type: Number },
    precision: { default: 2, type: Number },
    isPercentage: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const state = reactive({
      inputValue: ref<number | undefined>(undefined),
    });

    watch(
      () => props.value,
      (val, oldVal) => {
        if (val !== oldVal && state.inputValue !== props.value) {
          state.inputValue = props.value;
        }
      },
      { deep: true, immediate: true }
    );

    const onChange = (value: number) => {
      emit("input", value);
      emit("change", value);
      emit("formula", value);
    };

    const formatter = (value: number) => {
      const v = `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (props.isPercentage && v) {
        return `${v}%`;
      } else {
        return v;
      }
    };

    const parser = (value: string) => {
      const v = value.replace(/$s?|(,*)/g, "");
      if (props.isPercentage) {
        return v.replace("%", "");
      } else {
        return v;
      }
    };

    return () => (
      <a-input-number
        style="width:100%"
        max={props.maxNumberValue}
        min={props.minNumberValue}
        precision={props.precision}
        formatter={formatter}
        parser={parser}
        placeholder={props.placeholder}
        disabled={props.disabled}
        vOn:change={onChange}
        step={props.step}
        v-model={state.inputValue}
      />
    );
  },
});

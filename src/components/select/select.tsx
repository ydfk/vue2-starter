/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : select.tsx
 * Author : lyh67
 * Date : 2021-06-16 17:38:27
 */

import { computed, defineComponent, onMounted, PropType, reactive, ref, watch } from "@vue/composition-api";
import { ItemSourceModel } from "@/commons/models/baseModel";

export default defineComponent({
  props: {
    value: { type: Object as PropType<string | string[]> },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    allowClear: { type: Boolean, default: true },
    showSearch: { type: Boolean, default: false },
    selectOption: { type: Array as PropType<ItemSourceModel[]> },
  },
  setup(props, { emit }) {
    const state = reactive({
      selectValue: ref<string | string[] | undefined>(undefined),
      model: computed(() => (props.multiple ? "multiple" : "default")),
    });

    onMounted(() => {
      state.selectValue = props.value;
    });

    watch(
      () => props.value,
      (val, oldVal) => {
        if (val !== oldVal && state.selectValue !== props.value) {
          state.selectValue = props.value;
        }
      }
    );

    const filterOption = (val: string, option) => option.componentOptions.children[0].text.toLowerCase().indexOf(val.toLowerCase()) >= 0;
    const onChange = (value: string) => {
      state.selectValue = value;
      emit("input", value);
      emit("change", value);
    };
    return () => (
      <a-select
        allowClear={props.allowClear}
        placeholder={props.placeholder}
        disabled={props.disabled}
        mode={state.model}
        value={state.selectValue}
        on-change={onChange}
        filterOption={filterOption}
        showSearch={props.showSearch}
      >
        {props.selectOption?.map((s) => (
          <a-select-option value={s.value}>{s.text}</a-select-option>
        ))}
      </a-select>
    );
  },
});

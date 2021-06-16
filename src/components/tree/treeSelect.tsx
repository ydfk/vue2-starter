/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : treeSelect.tsx
 * Author : liyuhang
 * Date : 2021-06-16 21:36:42
 */

import { defineComponent, onMounted, PropType, reactive, ref } from "@vue/composition-api";
import { TreeItemModel } from "@/commons/models/baseModel";

export default defineComponent({
  props: {
    value: { type: Object as PropType<string | string[]> },
    treeData: { type: Array as PropType<TreeItemModel[]>, default: () => [], required: true },
    placeholder: { type: String, default: "输入关键字查询" },
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    allowClear: { type: Boolean, default: true },
    treeDefaultExpandAll: { type: Boolean, default: false },
    isParentNode: { type: Boolean, default: true },
    replaceFields: {
      type: Object,
      default: () => ({
        children: "children",
        title: "name",
        key: "id",
      }),
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      selectValue: ref<string | string[] | undefined>(undefined),
    });

    onMounted(() => {
      state.selectValue = props.value;
    });

    const getPopupContainer = (triggerNode) => {
      if (props.isParentNode) {
        return triggerNode.parentNode || document.body;
      } else {
        return document.body;
      }
    };

    const onChange = (val: string) => {
      emit("input", val);
      emit("change", val);
    };

    return () => (
      <a-tree-select
        treeCheckable={props.multiple}
        multiple={props.multiple}
        showSearch={false}
        allowClear={props.allowClear}
        treeData={props.treeData}
        replaceFields={props.replaceFields}
        searchPlaceholder={props.placeholder}
        placeholder={props.placeholder}
        treeNodeFilterProp={"title"}
        disabled={props.disabled}
        treeDefaultExpandAll={props.treeDefaultExpandAll}
        getPopupContainer={getPopupContainer}
        vOn:change={onChange}
        v-model={state.selectValue}
      />
    );
  },
});

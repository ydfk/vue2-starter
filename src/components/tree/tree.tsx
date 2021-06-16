/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : tree.tsx
 * Author : liyuhang
 * Date : 2021-06-16 21:22:18
 */

import { TreeItemModel } from "@/commons/models/baseModel";
import { defineComponent, onMounted, PropType, reactive, ref } from "@vue/composition-api";
import { getTreeDeepFirstChild } from "@/components/tree/treeMethod";

export default defineComponent({
  props: {
    treeData: { type: Array as PropType<TreeItemModel[]>, default: () => [], required: true },
    replaceFields: {
      type: Object,
      default: () => ({
        children: "children",
        title: "name",
        key: "id",
      }),
    },
    selectedKeys: { default: () => [], type: Array as PropType<string[]> },
    expandedKeys: { default: () => [], type: Array as PropType<string[]> },
  },
  setup(props, { emit }) {
    const state = reactive({
      treeSelectedKeys: ref<string[]>([]),
      treeExpandedKeys: ref<string[]>([]),
    });

    onMounted(() => {
      const firstKey = getTreeDeepFirstChild(props.treeData);
      state.treeSelectedKeys = props.selectedKeys;
      state.treeExpandedKeys = props.expandedKeys;

      if (state.treeSelectedKeys.length === 0) {
        state.treeSelectedKeys.push(firstKey);
      }

      if (state.treeExpandedKeys.length === 0) {
        state.treeExpandedKeys.push(firstKey);
      }
    });

    const onSelect = (selectedKeys: string[], e: { selected: boolean; selectedNodes; node; event }) => {
      if (e.selected) {
        state.treeSelectedKeys = selectedKeys;
        emit("select", state.treeSelectedKeys, e);
      }
    };

    const onExpand = (expandedKeys: string[], e: { expanded: boolean; node: { eventKey: string; _props: { dataRef: TreeItemModel } } }) => {
      emit("expend", { expanded: e.expanded, eventKey: e.node.eventKey, dataItem: e.node._props.dataRef }, expandedKeys);
    };

    return () => (
      <a-tree
        tree-data={props.treeData}
        replaceFields={props.replaceFields}
        defaultExpandAll={false}
        showLine={false}
        showIcon={false}
        selectedKeys={state.treeSelectedKeys}
        defaultExpandedKeys={state.treeExpandedKeys}
        vOn:select={onSelect}
        vOn:expand={onExpand}
      />
    );
  },
});

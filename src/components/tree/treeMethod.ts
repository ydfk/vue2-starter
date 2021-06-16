/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : treeMethod.ts
 * Author : liyuhang
 * Date : 2021-06-16 21:31:24
 */
import { TreeItemModel } from "@/commons/models/baseModel";

export const getTreeDeepFirstChild = (treeItems: TreeItemModel[]): string => {
  let firstKey = "";
  if (treeItems && treeItems.length > 0) {
    const firstHasChildren = treeItems.find((s) => s.children && s.children.length > 0);
    if (firstHasChildren) {
      if (firstHasChildren.children && firstHasChildren.children.length > 0) {
        firstKey = getTreeDeepFirstChild(firstHasChildren.children);
      } else {
        firstKey = firstHasChildren.id;
      }
    } else {
      firstKey = treeItems[0].id;
    }
  }

  return firstKey;
};

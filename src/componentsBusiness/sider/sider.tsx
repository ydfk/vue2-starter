/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : sider.tsx
 * Author : lyh67
 * Date : 2021-06-18 13:43:04
 */

import { defineComponent, reactive } from "@vue/composition-api";
import Menu from "@/componentsBusiness/menu/menu";

export default defineComponent({
  components: { Menu },
  props: {
    width: { type: [Number, String], default: 200 },
  },
  setup(props) {
    //@ts-ignore
    const getMenu = () => <Menu mode={"vertical"} />;
    return () => (
      <div class="sider">
        <a-layout-sider width={props.width}>{getMenu()}</a-layout-sider>
      </div>
    );
  },
});

/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : footer.tsx
 * Author : lyh67
 * Date : 2021-06-18 09:31:36
 */

import { defineComponent, reactive } from "@vue/composition-api";
import "./footer.sass";

export default defineComponent({
  setup() {
    const state = reactive({
      year: new Date().getFullYear(),
    });
    return () => (
      <a-layout-footer class="footer">
        <a-row type="flex" justify="space-between" align="middle">
          <a-col span={5}></a-col>
          <a-col span={14}>
            ©{state.year}
            <a class="company" href="http://www.tztech.net" target="_blank">
              青矩技术股份有限公司
            </a>
            版权所有 联系电话 400-006-7706 (Version:%BUILDNUMBER%, Revision:%REVISION%)
          </a-col>
          <a-col span={5}>
            推荐浏览器下载:&nbsp;
            <a href="https://www.iplaysoft.com/tools/chrome/" target="_blank">
              chrome
            </a>
            |
            <a href="https://www.mozilla.org/zh-CN/firefox/all/#product-desktop-release" target="_blank">
              firefox
            </a>
          </a-col>
        </a-row>
      </a-layout-footer>
    );
  },
});

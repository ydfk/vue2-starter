<!--
  - Copyright (c) QJJS. All rights reserved.
  - ProjectName: Qinyin.Web
  - FileName : footer.vue
  - Author : liyuhang
  - Date : 2020-03-05 23:46:17
  -->

<template>
  <div>
    <a-layout-footer class="footer">
      <a-row type="flex" justify="space-between" align="middle">
        <a-col :span="5"></a-col>
        <a-col :span="14">
          ©{{ year }}
          <a class="company" href="http://www.tztech.net" target="_blank">青矩技术股份有限公司</a>
          版权所有 联系电话 400-006-7706 (Version:%BUILDNUMBER%, Revision:%REVISION%)</a-col
        >
        <a-col :span="5">
          推荐浏览器下载:&nbsp;<a href="https://www.iplaysoft.com/tools/chrome/" target="_blank">chrome</a>
          |
          <a href="https://www.mozilla.org/zh-CN/firefox/all/#product-desktop-release" target="_blank">firefox</a>
        </a-col>
      </a-row>
    </a-layout-footer>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Footer extends Vue {
  year = new Date().getFullYear();
}
</script>
<style scoped lang="sass">
@import "../../assets/var"

$footer-color: #505050
.footer
    position: fixed
    background-color: white
    width: 100%
    bottom: 0
    height: $header-height
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1)
    font-size: 12px
    text-align: center
    color: $footer-color
    .company
        color: $footer-color
</style>

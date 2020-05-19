<!--
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2020-05-13 09:25:27
 * @LastEditors: ydfk
 * @LastEditTime: 2020-05-13 09:41:00
 -->
<template>
  <div id="app" v-cloak>
    <a-config-provider :locale="locale">
      <a-spin class="globalSpin" size="large" :spinning="spinning">
        <transition name="fade">
          <router-view />
        </transition>
      </a-spin>
    </a-config-provider>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import zhCnLocale from "@/commons/zhCNLocale";
import { ConfigProvider, Spin } from "ant-design-vue";
import { Action, Getter } from "vuex-class";
import { A_LOADED, G_LOADING } from "@/store/store.types";
import store from "@/store";

Vue.use(Spin);
Vue.use(ConfigProvider);

@Component
export default class App extends Vue {
  @Getter(G_LOADING) spinning: any;

  locale: any = zhCnLocale;

  created() {
    this.hideLoading();
  }

  @Action(A_LOADED) hideLoading: any;
}
</script>
<style lang="sass">
@import "assets/var"
@import "assets/mixin"

body
    font-family: -apple-system,Helvetica,Tahoma,Arial,"PingFang SC","PingFang SC Regular","Microsoft YaHei","微软雅黑","Source Han Sans","思源黑体",SimSun,"宋体",Heiti,"黑体","sans-serif"
    color: $primary-font-color
    #app
        font-size: $primary-fontSize
        height: 100%
        background-color: #F3F4F7
    .hand
        cursor: pointer
    .center
        @include flex-center
    .right
        display: flex
        display: -webkit-flex
        justify-content: flex-end
        align-items: center
    .left
        display: flex
        display: -webkit-flex
        justify-content: flex-start
        align-items: center
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td
        padding: 8px 8px !important
        /*white-space: nowrap*/
        /*word-break: break-all*/
        font-size: $primary-fontSize !important
    .ant-form-item
        margin-bottom: 15px
    /*.ant-modal-body*/
    /*    padding: 10px 30px 10px 30px !important*/
    .ant-tag
        margin-bottom: 2px
    .m-b-10
        margin-bottom: 10px !important
    .m-b-5
        margin-bottom: 5px !important
    .m-t-5
        margin-top: 5px !important
    .m-t-10
        margin-top: 10px !important
    .m-t-15
        margin-top: 15px !important
    .m-t-20
        margin-top: 20px !important
    .m-t-25
        margin-top: 25px !important
    .m-t-30
        margin-top: 30px !important
    .ant-descriptions-title
        margin-bottom: 10px
        margin-top: 10px
        border-bottom: 1px solid #e8e8e8
    .ant-descriptions-item
        padding-bottom: 5px
    .ant-descriptions-item-label
        font-weight: bold
</style>

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
@import "assets/common"
@import "assets/antFix"

body
  font-family: $fontFamily
  color: $primary-font-color

  #app
    font-size: $primary-fontSize
    height: 100%
    background-color: $app-background-color

  ul
    list-style: none
    margin: 0
    padding: 0
</style>

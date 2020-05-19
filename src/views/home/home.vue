<!--
  - Copyright (c) QJJS. All rights reserved.
  - ProjectName: Qinyin.Web
  - FileName : home.vue
  - Author : liyuhang
  - Date : 2020-02-29 18:40:38
  -->

<template>
  <div class="home">
    <a-layout>
      <Header />
      <a-layout-content class="content">
        <div class="contentBox">
          <transition name="fade">
            <router-view />
          </transition>
        </div>
      </a-layout-content>
      <Footer />
    </a-layout>
  </div>
</template>

<script lang="ts" src="./home.ts"></script>
<style scoped lang="sass" src="./home.sass"></style>

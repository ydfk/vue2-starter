<!--
  - Copyright (c) QJJS. All rights reserved.
  - ProjectName: Qinyin.Web
  - FileName : logo.vue
  - Author : liyuhang
  - Date : 2020-02-28 22:33:53
  -->

<template>
  <div class="logo" @click="onLogoClick">
    <img class="logoImg" src="../../../assets/images/logo.png" /><span class="systemName">{{ systemName }}</span>
  </div>
</template>

<script lang="ts" src="./logo.ts"></script>
<style scoped lang="sass" src="./logo.sass"></style>

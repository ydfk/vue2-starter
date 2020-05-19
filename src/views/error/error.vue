<!--
  - Copyright (c) QJJS. All rights reserved.
  - ProjectName: Qingyin.Web
  - FileName : error.vue
  - Author : liyuhang
  - Date : 2020-03-07 10:37:01
  -->

<template>
  <div class="error">
    <div class="imgBlock">
      <div class="imgEle"><errorSvg /></div>
    </div>
    <div class="content">
      <h1>出错了</h1>
      <div class="desc">{{ desc }}</div>
      <div class="actions">
        <a-button type="primary" @click="onHandleToHome">返回首页</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./error.ts"></script>
<style scoped lang="sass" src="./error.sass"></style>

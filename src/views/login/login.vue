<!--
  - Copyright (c) QJJS. All rights reserved.
  - ProjectName: Qinyin.Web
  - FileName : login.vue
  - Author : liyuhang
  - Date : 2020-02-29 16:38:16
  -->

<template>
  <div class="login">
    <a-layout>
      <a-layout-header class="header">
        <a-row type="flex" justify="space-between" align="middle">
          <a-col :span="22"><Logo :canClick="false" /></a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content class="contentBox center">
        <div class="box">
          <div class="center title">登录青音会议系统</div>
          <div class="center subtitle">开启一段不一样的工作之旅</div>
          <a-form-model class="form" :rules="rules" :ref="formRef" :model="loginForm">
            <a-form-model-item prop="code">
              <a-input placeholder="手机号" v-model="loginForm.code" />
            </a-form-model-item>
            <a-form-model-item prop="password">
              <a-input type="password" placeholder="密码" v-model="loginForm.password" />
            </a-form-model-item>
          </a-form-model>
          <a-button type="primary" html-type="submit" class="loginBtn" :loading="loading" block @click.enter="onSubmit">
            登录
          </a-button>
          <div class="loginFooter">
            <a @click="onForget">
              忘记密码？
            </a>
            <span>
              还没账号？
              <a @click="onRegister">
                注册
              </a>
            </span>
          </div>
        </div>
      </a-layout-content>
      <Footer />
    </a-layout>
  </div>
</template>

<script lang="ts" src="./login.ts"></script>
<style scoped lang="sass" src="./login.sass"></style>

<!--
  - Copyright (c) QJJS. All rights reserved.
  - ProjectName: Qingyin.Web
  - FileName : header.vue
  - Author : lyh67
  - Date : 2020-03-16 14:43:13
  -->

<template>
  <div>
    <a-layout-header class="header">
      <a-row type="flex" justify="space-between" align="middle">
        <a-col :span="4"><Logo /></a-col>
        <a-col :span="16">
          <a-menu
            class="menuList"
            :selectedKeys="menuKeys"
            :openKeys="menuOpenKeysKeys"
            mode="horizontal"
            @click="onMenuClick"
            @openChange="onMenuOpenChange"
          >
            <a-sub-menu>
              <span slot="title" class="submenu-title-wrapper">我的首页</span>
              <a-menu-item :key="router_home">二级菜单</a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-col>
        <a-col :span="4" class="userName">
          <a-dropdown :trigger="['click', 'hover']">
            <span class="ant-dropdown-link">
              <a-icon type="user" />
              <span class="name">&nbsp;&nbsp;{{ user.name }}&nbsp;&nbsp;</span>
              <a-icon type="down" />
            </span>
            <a-menu slot="overlay" @click="onUserNameMenuClick">
              <a-menu-item class="logout" key="0">
                <a-icon type="logout" />
                <span>退出登录</span>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </a-col>
      </a-row>
    </a-layout-header>
  </div>
</template>

<script lang="ts" src="./header.ts"></script>
<style scoped lang="sass" src="./header.sass"></style>

<!--
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-06-15 21:26:18
 * @LastEditors: ydfk
 * @LastEditTime: 2021-06-15 21:26:58
-->
<template>
  <div class="card">
    <a-card
      v-if="title"
      class="with-title-card"
      type="inner"
      :bordered="bordered"
      :hoverable="hoverable"
      :loading="loading"
      :headStyle="headStyle"
      :bodyStyle="bodyStyle"
    >
      <template #title>
        <slot name="title">
          {{ title }}
        </slot>
      </template>
      <template #extra>
        <slot name="extra"> </slot>
      </template>
      <slot></slot>
    </a-card>
    <a-card v-else class="no-title-card" :bordered="bordered" :hoverable="hoverable" :loading="loading" :headStyle="headStyle" :bodyStyle="bodyStyle">
      <slot></slot>
    </a-card>
  </div>
</template>
<script lang="ts" src="./card.tsx"></script>

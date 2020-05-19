<!--
  - Copyright (c) QJJS. All rights reserved.
  - ProjectName: Qinyin.Web
  - FileName : dialog.vue
  - Author : liyuhang
  - Date : 2020-03-03 16:47:38
  -->

<template>
  <div class="dialog">
    <a-modal
      v-if="visible"
      :title="title"
      :visible="visible"
      :destroyOnClose="true"
      :keyboard="false"
      :maskClosable="false"
      :width="modalWidth"
      :bodyStyle="bodyStyle"
      :closable="showCancel"
      @cancel="onCancel"
    >
      <slot></slot>
      <template #footer>
        <slot name="footer">
          <a-button key="submit" :type="okType" @click="onOk" v-if="showOk">
            {{ okText }}
          </a-button>
          <a-button key="cancel" :type="cancelType" @click="onCancel" v-if="showCancel">
            {{ cancelText }}
          </a-button>
        </slot>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" src="./dialog.ts"></script>
<style scoped lang="sass" src="./dialog.sass"></style>

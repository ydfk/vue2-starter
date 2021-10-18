<!--
  - Copyright (c) QJJS. All rights reserved.
  - ProjectName: bhikku.vue
  - FileName : TableLocal.vue
  - Author : lyh67
  - Date : 2021-10-15 10:29:25
  -->

<template>
  <div class="TableLocal">
    <a-skeleton avatar active :loading="loading">
      <Table
        name="本地数据列表"
        showExportBtn
        :localData="tableData"
        :table-key="tableKey"
        :columns="tableColumns"
        :actionFunc="setActions"
        :bordered="false"
        @action="onActions"
      >
        <template #headerRight><a-button @click="onRefreshData" type="primary">刷新列表数据</a-button></template>
      </Table>
    </a-skeleton>
  </div>
</template>

<script lang="ts" src="./tableLocal.ts"></script>

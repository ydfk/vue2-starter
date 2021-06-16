<!--
  - Copyright (c) QJJS. All rights reserved.
  - ProjectName: Qinyin.Web
  - FileName : table.vue
  - Author : liyuhang
  - Date : 2020-03-04 21:38:07
  -->

<template>
  <div class="table" :class="showWrapper ? 'wrapper' : ''">
    <div class="table-header" v-if="showHeader">
      <a-row type="flex" justify="space-between">
        <a-col :span="15">
          <a-row v-if="showSearch">
            <a-col :span="16">
              <a-input id="keyword" :placeholder="searchTip" v-model="keyword" />
            </a-col>
            <a-col :span="8">
              <a-button-group class="table-header-search-btn">
                <a-button type="primary" @click="onSearch" @keyup.enter.native="onSearch"> <a-icon type="search" />查询 </a-button>
                <a-button @click="onReset"> <a-icon type="undo" />重置 </a-button>
              </a-button-group>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="9" class="table-header-right">
          <slot name="headerRight">
            <a-button v-if="showExportBtn" type="primary" @click="onExport" :loading="exportLoading"> <a-icon type="export" />导出 </a-button>
          </slot>
        </a-col>
      </a-row>
    </div>
    <div :class="showHeader ? 'table-content' : 'table-content--noHeader'">
      <a-table
        :key="tableKey"
        :bordered="bordered"
        :loading="loading"
        :columns="tableColumns"
        :dataSource="dataSource"
        :pagination="false"
        :rowSelection="rowSelection"
        :customRow="customRow"
        :showHeader="showTableHeader"
        :scroll="scroll"
        @change="onTableChange"
      >
        <span slot="evaluationResultList" slot-scope="evaluationResultList">
          <row-evaluation-result-list :evaluationResultList="evaluationResultList"></row-evaluation-result-list>
        </span>
      </a-table>
    </div>
    <div class="table-footer" v-if="showPage">
      <a-pagination
        :showSizeChanger="showSizeChanger"
        :showQuickJumper="showQuickJumper"
        :pageSize.sync="pagination.pageSize"
        :total="pagination.total"
        :pageSizeOptions="pagination.pageSizeOptions"
        :showTotal="(total) => `共 ${total} 条数据`"
        :current="pagination.current"
        @change="onPageChange"
        @showSizeChange="onPageSizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./table.tsx"></script>
<style scoped lang="sass" src="./table.sass"></style>

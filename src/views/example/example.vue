<!--
  - Copyright (c) QJJS. All rights reserved.
  - ProjectName: bhikku.vue
  - FileName : example.vue
  - Author : lyh67
  - Date : 2021-06-15 16:49:20
  -->

<template>
  <div class="example">
    <a-row :gutter="12">
      <a-col :span="12">
        <Card title="时间控件">
          <template #extra><a-button type="link" @click="onRestDatePicker">重置时间</a-button></template>
          <a-row>
            <a-col :span="12"><DatePicker v-model="datePickerValue" :format="DATE_FORMAT" :showTime="true" /></a-col>
            <a-col :span="12">{{ showDatePickerValue }}</a-col>
          </a-row>
          <a-row class="m-t-30">
            <a-col :span="12"><DateRangePicker v-model="dateRangePickerValue" :format="DATE_FORMAT" :showTime="true" /></a-col>
            <a-col :span="12">{{ showDateRangePickerValue }}</a-col>
          </a-row>
        </Card>
      </a-col>
      <a-col :span="12">
        <Card title="时间控件">
          <template #title><span style="color: darkblue">其他控件</span></template>
          <a-button-group>
            <a-button @click="showDialog = true" type="primary">点此打开弹窗</a-button>
            <a-button @click="showDrawer = true" type="primary">点此打开抽屉</a-button>
          </a-button-group>
        </Card>
      </a-col>
    </a-row>
    <Dialog title="这是一个弹窗" :visible="showDialog" @ok="showDialog = false" @cancel="showDialog = false">这里是弹窗的内容</Dialog>
    <Drawer title="这是一个抽屉" :showDrawer="showDrawer" @close="showDrawer = false">这里是抽屉的内容</Drawer>
  </div>
</template>

<script lang="ts" src="./example.ts"></script>

<!--
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-06-15 18:12:15
 * @LastEditors: ydfk
 * @LastEditTime: 2021-08-16 10:27:41
-->
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
            <a-col :span="12">{{ showDatePickerValue }} </a-col>
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
          <a-row>
            <a-col :span="12">
              <a-button-group>
                <a-button @click="onOpenDialog" type="primary">点此打开弹窗</a-button>
                <a-button @click="showDrawer = true" type="primary">点此打开抽屉</a-button>
              </a-button-group>
            </a-col>
            <a-col :span="12" class="right">
              <a-radio-group v-model="menuType" @change="onMenuTypeChange">
                <a-radio :value="'top'">菜单顶部展示</a-radio>
                <a-radio :value="'left'">菜单左边展示</a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
          <a-row>
            <Upload :beforeUpload="beforeUpload" />
          </a-row>
          <a-row v-if="showFormDetail">
            <a-col :span="4">转账内容：</a-col>
            <a-col :span="20">{{ formModel }}</a-col>
          </a-row>
        </Card>
      </a-col>
    </a-row>
    <a-skeleton avatar active :loading="loading">
      <a-row>
        <a-col :span="24">
          <Card title="列表">
            <template #extra><a-button @click="onRefreshTable">刷新列表</a-button></template>
            <Table
              name="demo列表"
              showExportBtn
              :table-key="tableKey"
              :columns="tableColumns"
              :queryApi="tableQueryApi"
              :actionFunc="setActions"
              @action="onActions"
            >
              <template #headerLeft><a-button @click="onRefreshTable">刷新列表</a-button></template>
              <template #headerRight><a-button @click="onChangeTableQuery" type="primary">修改列表查询</a-button></template>
            </Table>
          </Card>
        </a-col>
      </a-row>
    </a-skeleton>
    <Dialog title="这是一个弹窗" :visible="showDialog" @ok="onOk" @cancel="showDialog = false">
      <a-form-model layout="horizontal" :rules="formRules" :ref="formRef" :model="formModel">
        <a-form-model-item prop="text" label="转账人姓名" hasFeedback>
          <a-input placeholder="转账人姓名" :maxLength="20" v-model="formModel.text" />
        </a-form-model-item>
        <a-form-model-item prop="amount" hasFeedback>
          <span slot="label">
            转账金额&nbsp;
            <a-tooltip title="金额不能随便输入">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <InputNumber placeholder="转账金额" v-model="formModel.amount" />
        </a-form-model-item>
        <a-form-model-item prop="type" label="转账方式" hasFeedback>
          <Select multiple placeholder="请选择转账方式" v-model="formModel.type" :selectOption="typeData" />
        </a-form-model-item>
      </a-form-model>
    </Dialog>
    <Drawer title="这是一个抽屉" :showDrawer="showDrawer" @close="showDrawer = false">这里是抽屉的内容</Drawer>
  </div>
</template>

<script lang="ts" src="./example.tsx"></script>

/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : tableLocal.ts
 * Author : lyh67
 * Date : 2021-10-15 10:29:48
 */

import { defineComponent, onMounted, reactive, ref, toRefs } from "@vue/composition-api";
import { TableActionKeyEnum, TableKeyEnum } from "@/components/table/tableEnum";
import { TableAction, TableColumn } from "@/components/table/tableModel";
import Table from "@/components/table/table";
import { TABLE_ACTION_DELETE, TABLE_ACTION_DETAIL } from "@/components/table/tableConst";
import { openSuccessMsg } from "@/components/dialog/dialogCommon";
import { DemoTableModel } from "@/commons/models/demoModel";
import { getDemoTableData } from "@/apis/demoApis";
import { DATE_FORMAT_NO_TIME_ZH, NUMBER_FORMAT_N2 } from "@/commons/constants";

export default defineComponent({
  components: { Table },
  props: {},
  setup(props) {
    const state = reactive({
      loading: true,
      tableKey: TableKeyEnum.tableLocal,
      tableColumns: ref<TableColumn[]>([
        {
          key: "name",
          title: "姓名",
          width: "20%",
          resizable: true,
          fixed: "left",
          filter: true,
        },
        {
          key: "idNo",
          title: "身份证",
          width: "20%",
          resizable: true,
          filter: true,
        },
        {
          key: "mobile",
          title: "手机",
          width: "10%",
          resizable: true,
        },
        {
          key: "email",
          title: "邮箱",
          width: "10%",
          resizable: true,
          filters: [{ text: "a@163.com", value: "a@163.com" }],
        },
        {
          key: "income",
          title: "收入",
          width: "10%",
          format: NUMBER_FORMAT_N2,
        },
        {
          key: "city",
          title: "城市",
          width: "10%",
          resizable: true,
          filters: [
            { text: "北京", value: "北京" },
            { text: "西安", value: "西安" },
          ],
        },
        {
          key: "sex",
          title: "性别",
          width: "5%",
          filters: [
            { text: "男", value: "男" },
            { text: "女", value: "女" },
          ],
        },
        {
          key: "time",
          title: "出生日期",
          width: "10%",
          format: DATE_FORMAT_NO_TIME_ZH,
        },
      ]),
      tableData: ref<DemoTableModel[]>([]),
    });

    const setActions = (): TableAction[] => {
      return [TABLE_ACTION_DETAIL, TABLE_ACTION_DELETE];
    };

    const onActions = async (record: DemoTableModel) => {
      const { id, actionKey } = record;
      if (actionKey === TableActionKeyEnum.DETAIL) {
        openSuccessMsg(`详情${record}`);
      } else if (actionKey === TableActionKeyEnum.DELETE) {
        openSuccessMsg(`删除${record}`);
      }
    };

    const onRefreshData = async () => {
      state.loading = true;
      state.tableData = await getDemoTableData();
      state.loading = false;
    };

    onMounted(async () => {
      await onRefreshData();
    });

    return {
      setActions,
      onActions,
      onRefreshData,
      ...toRefs(state),
    };
  },
});

/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : example.ts
 * Author : lyh67
 * Date : 2021-06-15 16:48:51
 */

import { computed, defineComponent, onMounted, reactive, ref, toRefs } from "@vue/composition-api";
import Card from "@/components/card/card";
import DatePicker from "@/components/datePicker/datePicker";
import DateRangePicker from "@/components/dateRangePicker/dateRangePicker";
import { openErrorMsg, openSuccessMsg } from "@/components/dialog/dialogCommon";
import moment from "moment";
import { DATE_FORMAT, DATE_FORMAT_NO_TIME_ZH } from "@/commons/constants";
import { datePickType } from "@/components/datePicker/datePickerType";
import Dialog from "@/components/dialog/dialog";
import Drawer from "@/components/drawer/drawer";
import { getRequireRule } from "@/commons/validate";
import useAntdFormModel from "@/hooks/useAntdFormModel";
import { BusEnum, FormEnum } from "@/commons/enums";
import InputNumber from "@/components/inputNumber/inputNumber";
import Select from "@/components/select/select";
import { ItemSourceModel, UploadFileModel } from "@/commons/models/baseModel";
import Table from "@/components/table/table";
import { TableActionKeyEnum, TableKeyEnum } from "@/components/table/tableEnum";
import { TableAction, TableColumn } from "@/components/table/tableModel";
import { TABLE_ACTION_DELETE, TABLE_ACTION_DETAIL } from "@/components/table/tableConst";
import useVueBus from "@/hooks/useVueBus";
import useVuex from "@/hooks/useVuex";
import Tag from "@/components/tag/tag";
import { G_MENU_SHOW_TOP, M_SET_MENU_SHOW_LEFT, M_SET_MENU_SHOW_TOP } from "@/store/store.types";
import Upload from "@/components/upload/upload";

type demoFormModel = {
  text: string;
  amount: number | undefined;
  type: string[] | undefined;
};

type demoTableModel = {
  name: string;
  mobile: string;
  email: string;
  sex: string;
  city: string;
  time: string;
  [key: string]: any;
};

export default defineComponent({
  components: { Card, DatePicker, DateRangePicker, Dialog, Drawer, InputNumber, Select, Table, Tag, Upload },
  setup() {
    const state = reactive({
      loading: true,
      datePickerValue: ref<datePickType>(moment()),
      dateRangePickerValue: ref<datePickType[]>([moment("2021-1-1"), moment()]),
      typeData: reactive<ItemSourceModel[]>([
        {
          value: "1",
          text: "支付宝",
        },
        {
          value: "2",
          text: "微信",
        },
      ]),
      showDialog: false,
      showDrawer: false,
      showFormDetail: false,
      formRules: {
        text: [getRequireRule("必填")],
        amount: [getRequireRule("必填")],
        type: [getRequireRule("必选择")],
      },
      formModel: reactive<demoFormModel>({
        text: "",
        amount: undefined,
        type: undefined,
      }),
      tableQueryApi: "demoTable",
      tableKey: TableKeyEnum.demo,
      tableColumns: ref<TableColumn[]>([]),
      menuType: "top",
    });

    const demoForm = useAntdFormModel(FormEnum.demo);
    const { useMutation, useGetter } = useVuex();

    const onRestDatePicker = () => {
      state.datePickerValue = moment();
      state.dateRangePickerValue = [moment("2021-1-1"), moment()];
    };

    const showDatePickerValue = computed(() => moment(state.datePickerValue).format(DATE_FORMAT));
    const showDateRangePickerValue = computed(
      () => `${state.dateRangePickerValue[0]?.format(DATE_FORMAT)} 到 ${state.dateRangePickerValue[1]?.format(DATE_FORMAT)}`
    );

    onMounted(() => {
      state.menuType = useGetter(G_MENU_SHOW_TOP) ? "top" : "left";
      state.tableColumns = [
        {
          key: "name",
          title: "姓名",
          width: "20%",
        },
        {
          key: "idNo",
          title: "身份证",
          width: "20%",
        },
        {
          key: "mobile",
          title: "手机",
          width: "20%",
        },
        {
          key: "email",
          title: "邮箱",
          width: "15%",
        },
        {
          key: "city",
          title: "城市",
          width: "10%",
        },
        {
          key: "sex",
          title: "性别",
          width: "5%",
          customRender: (sex: string) => {
            //@ts-ignore
            return <Tag color={sex == "男" ? "blue" : "pink"}>{sex}</Tag>;
          },

          sorter: false,
        },
        {
          key: "time",
          title: "出生日期",
          width: "10%",
          format: DATE_FORMAT_NO_TIME_ZH,
          filter: false,
        },
      ];
      state.loading = false;
    });

    const setActions = (): TableAction[] => {
      return [TABLE_ACTION_DETAIL, TABLE_ACTION_DELETE];
    };

    const onActions = async (record: demoTableModel) => {
      const { id, actionKey } = record;
      if (actionKey === TableActionKeyEnum.DETAIL) {
        openSuccessMsg(`详情${record}`);
      } else if (actionKey === TableActionKeyEnum.DELETE) {
        openSuccessMsg(`删除${record}`);
      }
    };

    const onOk = () => {
      demoForm.form().validate((valid) => {
        if (valid) {
          openSuccessMsg("转账成功");
          state.showDialog = false;
          state.showFormDetail = true;
        }
      });
    };

    const onMenuTypeChange = () => {
      if (state.menuType == "top") {
        useMutation(M_SET_MENU_SHOW_TOP);
      } else {
        useMutation(M_SET_MENU_SHOW_LEFT);
      }
    };

    const { emitBus } = useVueBus();

    return {
      ...toRefs(state),
      ...demoForm,
      formRef: FormEnum.demo,
      showDatePickerValue,
      showDateRangePickerValue,
      DATE_FORMAT,
      setActions,
      onActions,
      onRefreshTable: () => emitBus(BusEnum.refreshTable, state.tableKey),
      onRestDatePicker: onRestDatePicker,
      onOk: onOk,
      onMenuTypeChange: onMenuTypeChange,
      onOpenDialog: () => {
        state.showDialog = true;
        state.showFormDetail = false;
      },
      beforeUpload: (files: UploadFileModel[]) => {
        return new Promise<void>((resolve, reject) => {
          if (files.some((x) => x.extension == ".pdf")) {
            resolve();
          } else {
            openErrorMsg("只允许上传pdf");
            reject();
          }
        });
      },
      onChangeTableQuery: () => {
        state.tableQueryApi = `${state.tableQueryApi}?s=${new Date().getTime()}`;
      },
    };
  },
});

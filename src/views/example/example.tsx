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
import { DATE_FORMAT, DATE_FORMAT_NO_TIME_ZH, NUMBER_FORMAT_N2 } from "@/commons/constants";
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
import { DemoTableModel } from "@/commons/models/demoModel";

type demoFormModel = {
  text: string;
  amount: number | undefined;
  type: string[] | undefined;
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
          text: "?????????",
        },
        {
          value: "2",
          text: "??????",
        },
      ]),
      showDialog: false,
      showDrawer: false,
      showFormDetail: false,
      formRules: {
        text: [getRequireRule("??????")],
        amount: [getRequireRule("??????")],
        type: [getRequireRule("?????????")],
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
      selectedRowKeys: [],
      rowSelection: computed(() => {
        return {
          selectedRowKeys: state.selectedRowKeys,
          onChange: (selectedRowKeys: string[]) => {
            state.selectedRowKeys = selectedRowKeys;
          },
          hideDefaultSelections: true,
          selections: [
            {
              key: "all-checked",
              text: "????????????",
              onSelect: () => {},
            },
            {
              key: "no-checked",
              text: "????????????",
              onSelect: () => {
                state.selectedRowKeys = [];
              },
            },
          ],
        };
      }),
    });

    const demoForm = useAntdFormModel(FormEnum.demo);
    const { useMutation, useGetter } = useVuex();

    const onRestDatePicker = () => {
      state.datePickerValue = moment();
      state.dateRangePickerValue = [moment("2021-1-1"), moment()];
    };

    const showDatePickerValue = computed(() => moment(state.datePickerValue).format(DATE_FORMAT));
    const showDateRangePickerValue = computed(
      () => `${state.dateRangePickerValue[0]?.format(DATE_FORMAT)} ??? ${state.dateRangePickerValue[1]?.format(DATE_FORMAT)}`
    );

    onMounted(() => {
      state.menuType = useGetter(G_MENU_SHOW_TOP) ? "top" : "left";
      state.tableColumns = [
        {
          key: "name",
          title: "??????",
          width: "20%",
          resizable: true,
          fixed: "left",
          filter: true,
          // customRender: (name: string, record) => {
          //   if (record.children) {
          //     return (
          //       <div>
          //         <span>{name}</span>
          //         <a-button>ddd</a-button>
          //       </div>
          //     );
          //   } else {
          //     return <span>{name}</span>;
          //   }
          // },
        },
        {
          key: "idNo",
          title: "?????????",
          width: "20%",
          resizable: true,
          filter: true,
        },
        {
          key: "mobile",
          title: "??????",
          width: "10%",
          resizable: true,
        },
        {
          key: "email",
          title: "??????",
          width: "10%",
          resizable: true,
        },
        {
          key: "income",
          title: "??????",
          width: "10%",
          format: NUMBER_FORMAT_N2,
        },
        {
          key: "city",
          title: "??????",
          width: "10%",
          resizable: true,
        },
        {
          key: "sex",
          title: "??????",
          width: "5%",
          customRender: (sex: string) => {
            return <Tag color={sex == "???" ? "blue" : "pink"}>{sex}</Tag>;
          },
        },
        {
          key: "time",
          title: "????????????",
          width: "10%",
          format: DATE_FORMAT_NO_TIME_ZH,
        },
      ];
      state.loading = false;
    });

    const setActions = (): TableAction[] => {
      return [TABLE_ACTION_DETAIL, TABLE_ACTION_DELETE];
    };

    const onActions = async (record: DemoTableModel) => {
      const { id, actionKey } = record;
      if (actionKey === TableActionKeyEnum.DETAIL) {
        openSuccessMsg(`??????${record}`);
      } else if (actionKey === TableActionKeyEnum.DELETE) {
        openSuccessMsg(`??????${record}`);
      }
    };

    const onOk = () => {
      demoForm.form().validate((valid) => {
        if (valid) {
          openSuccessMsg("????????????");
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
            openErrorMsg("???????????????pdf");
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

/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : table.ts
 * Author : liyuhang
 * Date : 2020-03-04 21:38:23
 */

import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { TableKeyEnum, TableOrderEnum } from "./tableEnum";
import { TableAction, TableChangeModel, TableColumn, TableDataSource, TablePagination, TableSorterModel } from "./tableModel";
import rowEvaluationResultList from "../../views/projectEvaluation/rowEvaluationResultList.vue";
import { TABLE_ACTION_KEY, TABLE_PAGE_SIZE } from "./tableConst";
import { initColumns, fetchDataSource as tableFetchDataSource, initColumnActions } from "@/components/table/tableService";
import { setPageStore, getPageStore } from "./pageStorage";
import { BaseModel } from "@/commons/models/baseModel";
import { BusEnum } from "@/commons/enums";

@Component({
  components: {
    rowEvaluationResultList,
  },
})
export default class Table extends Vue {
  @Prop({ default: -1, type: [Number, String], required: true }) readonly tableKey!: TableKeyEnum;
  @Prop({ default: "", type: String }) readonly name!: string;
  @Prop({ default: () => [], type: Array }) readonly columns!: Array<TableColumn>;

  @Prop({ default: "", type: String }) readonly queryApi!: string;
  @Prop({ default: () => ({}) }) readonly queryParams!: Record<string, unknown> | string[];
  @Prop({ default: () => ({}), type: Function }) readonly customRow!: (record: any, index: any) => void;

  @Prop({ default: () => [], type: Array }) readonly descOrderBy!: Array<string>;
  @Prop({ default: () => [], type: Array }) readonly ascOrderBy!: Array<string>;
  @Prop({ default: null, type: Function }) readonly actionFunc!: (model: any) => Array<TableAction>;

  @Prop({ default: false, type: Boolean }) readonly showExportBtn!: boolean; //显示导出
  @Prop({ default: true, type: Boolean }) readonly showSearch!: boolean; // 显示查询
  @Prop({ default: true, type: Boolean }) readonly showHeader!: boolean; // 显示表头

  @Prop({ default: false, type: Boolean }) readonly showQuickJumper!: boolean;
  @Prop({ default: false, type: Boolean }) readonly showSizeChanger!: boolean;
  @Prop({ default: true, type: Boolean }) readonly showPage!: boolean; // 显示分页

  @Prop({ default: true, type: Boolean }) readonly showRecord!: boolean; // 显示序号

  @Prop({ default: "输入关键字查询", type: String }) readonly searchTip!: string;

  @Prop({ default: () => [], type: Array }) readonly localData!: BaseModel[];

  @Prop({ default: true, type: Boolean }) readonly bordered!: boolean;

  @Prop({ default: true, type: Boolean }) readonly showWrapper!: boolean;

  @Prop({ default: true, type: Boolean }) readonly showTableHeader!: boolean;

  @Prop({ default: () => ({}), type: Object }) readonly scroll!: Record<string, unknown>;

  @Prop({ default: null, type: Object }) readonly rowSelection!: Record<string, unknown>; // 列表选择配置

  keyword = "";
  loading = false;
  exportLoading = false;

  tableAscOrder: string[] = [];
  tableDescOrder: string[] = [];
  selectedRowKeys: string[] = [];

  pagination: TablePagination = new (class implements TablePagination {
    current = 1;
    pageSize = TABLE_PAGE_SIZE;
    pageSizeOptions = ["10", "20", "30", "40", "50"];
    total = 0;
  })();

  tableColumns: Array<TableColumn> = [];
  dataSource: Array<TableDataSource> = [];
  enterSearch = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      this.onSearch();
    }
  };

  get maxPageSize(): number {
    if (!this.showPage) {
      return 999999999;
    } else {
      return TABLE_PAGE_SIZE;
    }
  }

  get hasAction(): boolean {
    return this.tableColumns.some((x) => x.key == TABLE_ACTION_KEY);
  }

  get fetchDataSource() {
    return {
      QueryApi: this.queryApi,
      Columns: this.tableColumns,
      PageCurrent: this.pagination.current,
      PageSize: this.pagination.pageSize || this.maxPageSize,
      Keyword: this.keyword.trim(),
      QueryParams: this.queryParams,
      AscOrderBy: this.tableAscOrder,
      DescOrderBy: this.tableDescOrder,
      ActionFunc: this.actionFunc,
      SheetName: "",
    };
  }

  async created() {
    this.restOrder();
    this.pagination.pageSize = this.maxPageSize;
    this.tableColumns = initColumns(this.columns, this.showRecord);
    await this.refreshTable();
    this.$bus.on(BusEnum.refreshTable, this.emitTableRefresh);
  }

  mounted() {
    window.addEventListener("keyup", this.enterSearch, false);
  }

  beforeDestroy() {
    this.$bus.off(BusEnum.refreshTable, this.emitTableRefresh);
    window.removeEventListener("keyup", this.enterSearch);
  }

  async onTableChange(pagination: TableDataSource, filters: any, sorter: TableSorterModel) {
    if (sorter) {
      this.tableAscOrder = [];
      this.tableDescOrder = [];

      const key = sorter.column && sorter.column.sortKey !== undefined ? sorter.column.sortKey : sorter.columnKey;

      if (sorter.order === TableOrderEnum.ascend) {
        this.tableAscOrder = [key];
      } else if (sorter.order === TableOrderEnum.descend) {
        this.tableDescOrder = [key];
      }

      await this.refreshTable();
    }
  }

  async onPageChange(current: number, pageSize: number) {
    this.pagination.current = current;
    this.pagination.pageSize = pageSize;
    setPageStore(this.tableKey.toString(), current);
    await this.refreshTable();
  }

  async onPageSizeChange(current: number, pageSize: number) {
    this.pagination.current = current;
    this.pagination.pageSize = pageSize;
    setPageStore(this.tableKey.toString(), this.pagination.current);
    await this.refreshTable();
  }

  async onSearch() {
    this.pagination.current = 1;
    setPageStore(this.tableKey.toString(), this.pagination.current);
    await this.refreshTable();
  }

  async onReset() {
    this.keyword = "";
    this.pagination.current = 1;
    setPageStore(this.tableKey.toString(), this.pagination.current);
    this.restOrder();
    await this.refreshTable();
  }

  onActionClick(data: TableDataSource) {
    this.onEmitAction(data);
  }

  async onExport() {
    this.exportLoading = true;
    //TODO 导出
    this.change();
    this.exportLoading = false;
  }

  async refreshTable() {
    const page = getPageStore(this.tableKey.toString());
    if (page) {
      this.pagination.current = page;
    }

    this.loading = true;
    const pagedResult = await tableFetchDataSource(this.fetchDataSource, this.localData);
    //// 设置排序 受控属性 来修改排序箭头样式
    this.columns.forEach((s) => {
      const key = s.sortKey != undefined ? s.sortKey : s.key;

      if (this.tableDescOrder?.includes(key)) {
        s.sortOrder = TableOrderEnum.descend;
      } else if (this.tableAscOrder?.includes(key)) {
        s.sortOrder = TableOrderEnum.ascend;
      } else {
        s.sortOrder = false;
      }
    });

    this.dataSource = pagedResult.pageResults;
    this.pagination.total = pagedResult.totalCount;

    //// 设置操作列
    this.tableColumns = initColumnActions(this.dataSource, this.tableColumns);

    if (this.hasAction && this.tableColumns.length > 0) {
      this.tableColumns.forEach((column) => {
        if (column.key === TABLE_ACTION_KEY) {
          column.customRender = (text, record: TableDataSource) => {
            const actions = record.actions;
            if (actions) {
              if (actions.length <= 3) {
                return actions.map((action, index) => {
                  return this.getAction(action, record, actions.length > 1 && index !== actions.length - 1);
                });
              } else {
                return (
                  <span>
                    {this.getAction(actions[0], record)}
                    {this.getAction(actions[1], record)}
                    <a-dropdown overlayClassName="tableAction">
                      <a-menu slot="overlay">
                        {record.moreActions?.map((action) => {
                          return <a-menu-item>{this.getAction(action, record, false)}</a-menu-item>;
                        })}
                      </a-menu>
                      <a>
                        更多
                        <a-icon type="down" />
                      </a>
                    </a-dropdown>
                  </span>
                );
              }
            } else {
              return "";
            }
          };
        }
      });
    }

    //// 触发 change 事件
    this.change();
    this.loading = false;
    this.$emit("callback", pagedResult);
  }

  getAction(action: TableAction, record: TableDataSource, showDivider = true) {
    return (
      <span>
        <a-button
          class={`tableBtn ${action.key}`}
          type="link"
          onClick={() =>
            this.onActionClick(
              Object.assign(record, {
                actionKey: action.key,
              })
            )
          }
        >
          {action.title}
        </a-button>
        {showDivider ? <a-divider type="vertical" /> : ""}
      </span>
    );
  }

  change() {
    this.onChange({
      key: this.tableKey,
      column: this.tableColumns,
      dataSource: this.dataSource,
      pagination: this.pagination,
    });
  }

  async emitTableRefresh(refreshKey: TableKeyEnum, refreshPage = 1) {
    if (refreshKey === this.tableKey) {
      const page = getPageStore(this.tableKey.toString());
      if (page) {
        refreshPage = page;
      }

      this.pagination.current = refreshPage;
      setPageStore(this.tableKey.toString(), this.pagination.current);
      await this.refreshTable();
    }
  }

  @Emit("action") onEmitAction(data: TableDataSource) {}

  @Emit("add") onAdd() {}

  @Emit("change") onChange(tableChange: TableChangeModel) {}

  private restOrder() {
    this.tableAscOrder = this.ascOrderBy;
    this.tableDescOrder = this.descOrderBy;
  }
}

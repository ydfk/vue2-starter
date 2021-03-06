/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : table.ts
 * Author : liyuhang
 * Date : 2020-03-04 21:38:23
 */

import { computed, defineComponent, onMounted, PropType, reactive, ref, watch } from "@vue/composition-api";
import { TableFilterOperatorEnum, TableKeyEnum, TableOrderEnum } from "./tableEnum";
import {
  TableAction,
  TableColumn,
  TableColumnFilterModel,
  TableDataSource,
  TableFilterDescriptor,
  TableColumnFilterDropdownModel,
  TablePageQuery,
  TablePagination,
  TableQueryKeyDefault,
  TableQueryKeyModel,
  TableResultKeyDefault,
  TableResultKeyModel,
  TableSorterModel,
} from "@/components/table/tableModel";
import { BaseModel } from "@/commons/models/baseModel";
import { TABLE_ACTION_KEY, TABLE_PAGE_SIZE } from "@/components/table/tableConst";
import useEnterKeyupEvent from "@/hooks/useEnterKeyupEvent";
import { fetchDataSource, initColumnActions, initColumns, tableExport } from "@/components/table/tableMethod";
import useVueBus from "@/hooks/useVueBus";
import { BusEnum } from "@/commons/enums";
import { getPageStore, setPageStore } from "./pageStorage";
import "./table.sass";
import VueDraggableResizable from "vue-draggable-resizable";
import useEvent from "@/hooks/useEvent";

export default defineComponent({
  components: { VueDraggableResizable },
  props: {
    tableKey: {
      default: -1,
      type: [Number, String],
      required: true,
    },
    size: { default: "default", type: String }, //表格大小	default | middle | small
    name: { default: "", type: String },
    searchTip: { default: "输入关键字查询", type: String },
    columns: { default: () => [], type: Array as PropType<TableColumn[]> },
    actionFunc: { default: null, type: Function as PropType<(model: any) => Array<TableAction>> },

    queryApi: { default: "", type: String },
    queryListApi: { default: "", type: String }, //返回所有数据，前台实现分页
    queryParams: {
      default: () => {},
      type: Object as PropType<Record<string, any>>,
    },
    localData: { default: () => [], type: Array as PropType<BaseModel[]> }, //直接使用数据，前台分页
    pageSize: { default: TABLE_PAGE_SIZE, type: Number },

    exportQuery: { default: null, type: Object as PropType<TablePageQuery> }, //导出查询

    queryKey: {
      default: () => TableQueryKeyDefault,
      type: Object as PropType<TableQueryKeyModel>,
    },
    resultKey: {
      default: () => TableResultKeyDefault,
      type: Object as PropType<TableResultKeyModel>,
    },
    rowKey: { default: "id", type: String },
    rowSelection: { default: null, type: Object as PropType<Record<string, any>> }, // 列表选择配置
    rememberPage: { default: false, type: Boolean }, // 记住页码
    scroll: {
      default: () => {},
      type: Object as PropType<Record<string, any>>,
    }, // 固定滚动

    showWrapper: { default: false, type: Boolean },

    showExportBtn: { default: false, type: Boolean },
    showSearch: { default: true, type: Boolean },
    showHeader: { default: true, type: Boolean },
    showTableHeader: { default: true, type: Boolean },

    showQuickJumper: { default: false, type: Boolean },
    showSizeChanger: { default: false, type: Boolean },
    showPage: { default: true, type: Boolean },
    showRecord: { default: true, type: Boolean }, //是否显示序号
    bordered: { default: true, type: Boolean },
    customHeaderRow: {
      default: () => {},
      type: Function as PropType<(column: any, index: any) => void>,
    },
    customRow: {
      default: () => {},
      type: Function as PropType<(record: any, index: any) => void>,
    },
    descOrderBy: { default: () => [], type: Array as PropType<string[]> },
    ascOrderBy: { default: () => [], type: Array as PropType<string[]> },
    resetFunc: { default: null, type: Function as PropType<() => Promise<void>> },
    rowClassName: {
      default: (record: any, index: any) => {
        if (index % 2 === 1) {
          return "dark-row";
        }
        return "";
      },
      type: Function as PropType<(record: any, index: any) => string>,
    },

    childrenColumnName: { default: "children", type: String }, //指定树形结构的列名
    defaultExpandAllRows: { default: false, type: Boolean }, //初始时，是否展开所有行
    defaultExpandedRowKeys: { default: null, type: Array as PropType<string[]> }, //默认展开的行
    expandedRowKeys: { default: null, type: Array as PropType<string[]> }, //展开的行，控制属性
    expandRowByClick: { default: false, type: Boolean }, //通过点击行来展开子行
    expandIconColumnIndex: { default: 1, type: Number }, //展开的图标显示在哪一列，如果没有 rowSelection，默认显示在第一列，否则显示在选择框后面
    indentSize: { default: 15, type: Number }, //展示树形数据时，每层缩进的宽度，以 px 为单位
    ellipsis: { default: false, type: Boolean }, // 是否自动省略超长的列内容
    expandIcon: {},
    onlyHasDataShowExpandedRow: { default: false, type: Boolean }, //是在只有数据的时候才展示展开按钮,可使用showExpandedRowKey指定data中判断字段
    showExpandedRowKey: { default: "hasExpandedRow", type: String }, //指定dataSource中那个字段来判断展示，需要和onlyHasDataShowExpandedRow配合
    headerLeftProps: {
      default: () => {
        return { xl: 18, xxl: 16 };
      },
      type: Object as PropType<Record<string, any>>,
    }, //列表头部左边的属性设置
    headerRightProps: {
      default: () => {
        return { xl: 6, xxl: 8 };
      },
      type: Object as PropType<Record<string, any>>,
    }, //列表头部右边的属性设置
  },
  setup(props, { emit, slots }) {
    const state = reactive({
      loading: true,
      tableId: computed(() => `table_${props.tableKey}_${new Date().getTime()}`),
      searchText: "",
      tableLoading: false,
      exportLoading: false,

      tableAscOrder: ref<string[]>([]),
      tableDescOrder: ref<string[]>([]),
      selectedRowKeys: ref<string[]>([]),

      tableColumns: ref<TableColumn[]>([]),
      dataSource: ref<TableDataSource[]>([]),

      pagination: reactive<TablePagination>({
        current: 1,
        pageSize: props.pageSize,
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        total: 0,
      }),

      maxPageSize: computed(() => {
        if (!props.showPage) {
          return 999999999;
        } else {
          return props.pageSize;
        }
      }),
      hasAction: computed(() => state.tableColumns.some((x) => x.key == TABLE_ACTION_KEY)),
      fetchDataSource: computed<TablePageQuery>(() => {
        return {
          queryApi: props.queryApi,
          queryListApi: props.queryListApi,
          columns: state.tableColumns,
          pageCurrent: state.pagination.current,
          pageSize: state.pagination.pageSize || state.maxPageSize,
          searchText: state.searchText.trim(),
          queryParams: props.queryParams,
          ascOrderBy: state.tableAscOrder,
          descOrderBy: state.tableDescOrder,
          actionFunc: props.actionFunc,
          sheetName: "",
          filters: [],
        };
      }),
      draggingState: reactive({}),
      tableQueryKey: computed(() => Object.assign(TableQueryKeyDefault, props.queryKey)),
      tableResultKey: computed(() => Object.assign(TableQueryKeyDefault, props.resultKey)),
      tableColumnFilters: reactive<TableFilterDescriptor[]>([]),
      tableHeaderLeftProps: computed(() => {
        return {
          props: props.headerLeftProps,
        };
      }),
      tableHeaderRightProps: computed(() => {
        return {
          props: props.headerRightProps,
        };
      }),
    });

    /**
     * 重置排序
     */
    const restOrder = () => {
      state.tableAscOrder = props.ascOrderBy;
      state.tableDescOrder = props.descOrderBy;
    };

    /**
     * 列表操作列
     * @param action
     * @param record
     * @param showDivider
     */
    const getAction = (action: TableAction, record: TableDataSource, showDivider = true) => {
      return (
        <span>
          <a-button
            class={`tableBtn ${action.key}`}
            type="link"
            onClick={() =>
              emit(
                "action",
                Object.assign(record, {
                  actionKey: action.key,
                })
              )
            }>
            {action.title}
          </a-button>
          {showDivider ? <a-divider type="vertical" /> : ""}
        </span>
      );
    };

    /**
     * 刷新列表
     */
    const refreshTable = async () => {
      const page = getPageStore(props.tableKey.toString());
      if (page && props.rememberPage) {
        state.pagination.current = page;
      }

      state.tableLoading = true;
      state.fetchDataSource.filters = JSON.parse(JSON.stringify(state.tableColumnFilters));
      const pagedResult = await fetchDataSource(
        state.fetchDataSource,
        props.localData,
        state.tableQueryKey,
        state.tableResultKey,
        props.childrenColumnName,
        props.rowKey
      );

      // 设置排序 受控属性 来修改排序箭头样式
      props.columns.forEach((s) => {
        const key = s.sortKey != undefined ? s.sortKey : s.key;

        if (state.tableDescOrder?.includes(key)) {
          s.sortOrder = TableOrderEnum.descend;
        } else if (state.tableAscOrder?.includes(key)) {
          s.sortOrder = TableOrderEnum.ascend;
        } else {
          s.sortOrder = false;
        }

        if (s.filter) {
          s.filterIcon = (filtered) => {
            return <a-icon class={`${filtered ? "table-filterIcon-filtered" : "table-filterIcon"}`} type={"search"} />;
          };

          s.filterDropdown = (filter: TableColumnFilterDropdownModel) => {
            return (
              <div style={{ padding: "8px" }}>
                <a-input
                  placeholder={`请输入${filter.column.title}`}
                  style={{ width: "208px", marginBottom: "8px", display: "block" }}
                  value={filter.selectedKeys[0]}
                  onChange={(e) => filter.setSelectedKeys(e.target.value ? [e.target.value] : [])}
                />
                <a-button
                  type={"primary"}
                  icon={"search"}
                  size={"small"}
                  style={{ width: "100px", marginRight: "8px" }}
                  onClick={() => {
                    filter.confirm();
                  }}>
                  查询
                </a-button>
                <a-button
                  size={"small"}
                  icon={"undo"}
                  style={{ width: "100px" }}
                  onClick={() => {
                    filter.clearFilters();
                  }}>
                  重置
                </a-button>
              </div>
            );
          };
        }

        if ((s.filters && s.filters.length > 0) || s.filter) {
          s.setFilterDropdown = (filter: TableColumnFilterDropdownModel) => {
            s.clearFilterDropdown = filter.clearFilters;
          };
        }
      });

      state.dataSource = pagedResult.pageResults;
      state.pagination.total = pagedResult.totalCount;

      // 设置操作列
      state.tableColumns = initColumnActions(state.dataSource, state.tableColumns, state.tableId);

      if (state.hasAction && state.tableColumns.length > 0) {
        state.tableColumns.forEach((column) => {
          if (column.key === TABLE_ACTION_KEY) {
            column.customRender = (text, record: TableDataSource) => {
              const actions = record.actions;
              if (actions) {
                if (actions.length <= 3) {
                  return actions.map((action, index) => {
                    return getAction(action, record, actions.length > 1 && index !== actions.length - 1);
                  });
                } else {
                  return (
                    <span>
                      {getAction(actions[0], record)}
                      {getAction(actions[1], record)}
                      <a-dropdown overlayClassName="tableAction">
                        <a-menu slot="overlay">
                          {record.moreActions?.map((action) => {
                            return <a-menu-item>{getAction(action, record, false)}</a-menu-item>;
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

      // 触发 change 事件
      emitChange();
      state.tableLoading = false;
      emit("callback", pagedResult);
    };

    /**
     * 相应列表刷新bus事件
     * @param refreshKey 刷新的列表key
     * @param refreshPage 刷新的页码默认1
     */
    const busTableRefresh = async (refreshKey: TableKeyEnum, refreshPage = 1) => {
      if (refreshKey === props.tableKey) {
        const page = getPageStore(props.tableKey.toString());
        if (page && props.rememberPage) {
          refreshPage = page;
        }
        state.pagination.current = refreshPage;
        setPageStore(props.tableKey.toString(), state.pagination.current);
        await refreshTable();
      }
    };

    /**
     * 响应列表导出bus事件
     * @param key 列表key
     */
    const busTableExport = async (key: TableKeyEnum) => {
      if (key === props.tableKey) {
        await onExport();
      }
    };

    /**
     * 列表查询事件
     */
    const onSearch = async () => {
      state.pagination.current = 1;
      setPageStore(props.tableKey.toString(), state.pagination.current);
      await refreshTable();
    };

    /**
     * 重置列表事件
     */
    const onReset = async () => {
      state.searchText = "";
      state.pagination.current = 1;
      setPageStore(props.tableKey.toString(), state.pagination.current);
      restOrder();

      state.tableColumns.forEach((c) => {
        c.clearFilterDropdown && c.clearFilterDropdown();
      });

      if (props.resetFunc && typeof props.resetFunc == "function") {
        const reset = props.resetFunc();
        if (reset && reset.then) {
          reset.then(async () => await refreshTable());
        }
      } else {
        await refreshTable();
      }
    };

    /**
     * 列表导出
     */
    const onExport = async () => {
      state.exportLoading = true;
      const fetchDataSource = JSON.parse(JSON.stringify(state.fetchDataSource));
      if (props.exportQuery) {
        Object.assign(fetchDataSource, props.exportQuery);
        Object.assign(fetchDataSource, { pageCurrent: 1 });
      }

      await tableExport(props.name, fetchDataSource, state.tableQueryKey, state.tableResultKey, props.childrenColumnName);
      state.exportLoading = false;
    };

    /**
     * 列表改变事件
     */
    const onTableChange = async (pagination: TableDataSource, filters: TableColumnFilterModel, sorter: TableSorterModel) => {
      state.tableColumnFilters = [];
      if (sorter || filters) {
        state.tableAscOrder = [];
        state.tableDescOrder = [];

        const key = sorter.column && sorter.column.sortKey !== undefined ? sorter.column.sortKey : sorter.columnKey;

        if (sorter.order === TableOrderEnum.ascend) {
          state.tableAscOrder = [key];
        } else if (sorter.order === TableOrderEnum.descend) {
          state.tableDescOrder = [key];
        }

        if (filters) {
          Object.keys(filters).forEach((key) => {
            const column = state.tableColumns.find((s) => s.key == key);
            if (column && filters[key] && filters[key].length > 0) {
              if (column.filter) {
                state.tableColumnFilters.push({
                  member: key,
                  value: filters[key][0],
                  operator: TableFilterOperatorEnum.Contains,
                });
              } else if (column.filters && column.filters.length > 0) {
                state.tableColumnFilters.push({
                  member: key,
                  value: filters[key],
                  operator: TableFilterOperatorEnum.IsIn,
                });
              }
            }
          });
        }

        await refreshTable();
      }
    };

    const onTableExpand = (expanded, record) => {
      emit("expand", expanded, record);
    };

    const onExpandedRowsChange = (expandedRowKeys) => {
      emit("expandedRowsChange", expandedRowKeys);
    };

    /**
     * 翻页事件
     */
    const onPageChange = async (current: number, pageSize: number) => {
      state.pagination.current = current;
      state.pagination.pageSize = pageSize;
      setPageStore(props.tableKey.toString(), current);
      await refreshTable();
    };

    /**
     * 修改页码事件
     * @param current
     * @param pageSize
     */
    const onPageSizeChange = async (current: number, pageSize: number) => {
      state.pagination.current = current;
      state.pagination.pageSize = pageSize;
      setPageStore(props.tableKey.toString(), state.pagination.current);
      await refreshTable();
    };

    /**
     * emit change事件
     */
    const emitChange = () => {
      emit("change", {
        key: props.tableKey,
        query: state.fetchDataSource,
        column: state.tableColumns,
        dataSource: state.dataSource,
        pagination: state.pagination,
      });
    };

    /**
     * 响应屏幕变化
     */
    const handleResize = () => {
      initColumnActions(state.dataSource, state.tableColumns, state.tableId);
    };

    /**
     * 注册回车事件
     */
    useEnterKeyupEvent(onSearch);
    useEvent("resize", handleResize);

    ////注册bus事件
    const { registerBus } = useVueBus();
    registerBus(BusEnum.refreshTable, busTableRefresh);
    registerBus(BusEnum.exportTable, busTableExport);

    const initTable = async () => {
      restOrder();
      state.pagination.pageSize = state.maxPageSize;
      state.tableColumns = initColumns(props.columns, props.showRecord, props.ellipsis);
      await refreshTable();

      state.tableColumns.forEach((col: TableColumn) => {
        if (typeof col.width == "number") {
          state.draggingState[col.key] = col.width;
        }
      });
    };

    ////生命周期
    onMounted(async () => {
      state.loading = true;
      await initTable();
      state.loading = false;
    });

    watch(
      () => props.queryApi,
      async (newVal, oldVal) => {
        if (newVal != oldVal) {
          await refreshTable();
        }
      }
    );

    watch(
      () => props.queryListApi,
      async (newVal, oldVal) => {
        if (newVal != oldVal) {
          await refreshTable();
        }
      }
    );

    watch(
      () => props.columns,
      async (newVal, oldVal) => {
        if (newVal != oldVal) {
          await initTable();
        }
      }
    );

    const resizableTitle = (h, props, children) => {
      let thDom = null;
      const { key, ...restProps } = props;

      const col = state.tableColumns.find((col) => {
        const k = col.dataIndex || col.key;
        return k === key;
      });

      if (!col || !col.width || !col.resizable) {
        return <th {...restProps}>{children}</th>;
      }

      const onDrag = (x: number) => {
        state.draggingState[key] = 0;
        col.width = Math.max(x, 1);
      };

      const onDragStop = () => {
        //@ts-ignore
        state.draggingState[key] = thDom.getBoundingClientRect().width;
      };

      return (
        <th {...restProps} v-ant-ref={(r) => (thDom = r)} width={col.width} class="resize-table-th">
          {children}
          <VueDraggableResizable
            key={col.key}
            class="table-draggable-handle"
            w={10}
            x={state.draggingState[key] || col.width}
            z={1}
            axis="x"
            draggable={true}
            resizable={false}
            onDragging={onDrag}
            onDragstop={onDragStop}
          />
        </th>
      );
    };

    const tableHeader = () => {
      return (
        props.showHeader && (
          <div class="table-header">
            <a-row type="flex" justify="space-between">
              <a-col {...state.tableHeaderLeftProps}>
                <div class="table-header-left">
                  {slots.headerLeft && slots.headerLeft()}
                  {props.showSearch && (
                    <div class="table-header-search">
                      <a-input class="table-header-searchText" placeholder={props.searchTip} vModel={state.searchText} />
                      <a-button-group class="table-header-search-btn">
                        <a-button type="primary" on-click={onSearch}>
                          <a-icon type="search" />
                          查询
                        </a-button>
                        <a-button on-click={onReset}>
                          <a-icon type="undo" />
                          重置
                        </a-button>
                      </a-button-group>
                    </div>
                  )}
                  {slots.headerSearchRight && slots.headerSearchRight()}
                </div>
              </a-col>
              <a-col {...state.tableHeaderRightProps} class="table-header-right">
                <div>
                  {slots.headerRight && slots.headerRight()}
                  {props.showExportBtn && (
                    <a-button type="primary" on-click={onExport} loading={state.exportLoading}>
                      <a-icon type="export" />
                      导出
                    </a-button>
                  )}
                </div>
              </a-col>
            </a-row>
            {slots.headerNextLine && slots.headerNextLine()}
          </div>
        )
      );
    };

    const dynamicProps = () => {
      const p: any = {};

      if (props.scroll && props.scroll != {}) {
        p.scroll = props.scroll;
      }

      if (props.defaultExpandedRowKeys && props.defaultExpandedRowKeys != null) {
        p.defaultExpandedRowKeys = props.defaultExpandedRowKeys;
      }

      if (props.expandedRowKeys && props.expandedRowKeys != null) {
        p.expandedRowKeys = props.expandedRowKeys;
      }

      if (props.rowKey && props.rowKey != null) {
        p.rowKey = props.rowKey;
      }

      return { props: p };
    };

    const scopedSlots = () => {
      const scopedSlots: any = {};

      if (slots.expandedRowRender) {
        scopedSlots.expandedRowRender = (record, index, indent, expanded) =>
          slots.expandedRowRender && slots.expandedRowRender(record, index, indent, expanded);
      }

      if (slots.expandIcon) {
        scopedSlots.expandIcon = (expandProps) => slots.expandIcon && slots.expandIcon(expandProps);
      } else {
        if (slots.expandedRowRender && props.onlyHasDataShowExpandedRow) {
          scopedSlots.expandIcon = (expandProps) => {
            if (expandProps.record[props.showExpandedRowKey]) {
              return (
                <div
                  role="button"
                  tabIndex={0}
                  class={`ant-table-row-expand-icon ${expandProps.expanded ? "ant-table-row-expanded" : "ant-table-row-collapsed"}`}
                  onClick={(event) => {
                    expandProps.onExpand(expandProps.record, event);
                  }}
                />
              );
            } else {
              return null;
            }
          };
        }
      }

      return { scopedSlots };
    };

    const tableBody = () => (
      <div class={props.showHeader ? "table-content" : "table-content--noHeader"}>
        <a-table
          key={props.tableKey}
          bordered={props.bordered}
          loading={state.tableLoading}
          columns={state.tableColumns}
          dataSource={state.dataSource}
          pagination={false}
          rowSelection={props.rowSelection}
          customHeaderRow={props.customHeaderRow}
          customRow={props.customRow}
          showHeader={props.showTableHeader}
          components={{
            header: {
              cell: resizableTitle,
            },
          }}
          scroll={props.scroll}
          rowClassName={props.rowClassName}
          size={props.size}
          childrenColumnName={props.childrenColumnName}
          defaultExpandAllRows={props.defaultExpandAllRows}
          expandRowByClick={props.expandRowByClick}
          indentSize={props.indentSize}
          expandIconColumnIndex={props.expandIconColumnIndex}
          expandIcon={props.expandIcon}
          {...dynamicProps()}
          on-change={onTableChange}
          on-expand={onTableExpand}
          on-expandedRowsChange={onExpandedRowsChange}
          {...scopedSlots()}
        />
      </div>
    );

    const tableFooter = () =>
      props.showPage && (
        <div class="table-footer">
          <a-pagination
            showSizeChanger={props.showSizeChanger}
            showQuickJumper={props.showQuickJumper}
            pageSize={state.pagination.pageSize}
            total={state.pagination.total}
            pageSizeOptions={state.pagination.pageSizeOptions}
            showTotal={(total) => `共 ${total} 条数据`}
            current={state.pagination.current}
            vOn:change={onPageChange}
            vOn:showSizeChange={onPageSizeChange}
          />
        </div>
      );

    return () => (
      <div id={state.tableId} class={props.showWrapper ? "table wrapper" : "table"}>
        <a-skeleton loading={state.loading} active avatar>
          {tableHeader()}
          {tableBody()}
          {tableFooter()}
        </a-skeleton>
      </div>
    );
  },
});

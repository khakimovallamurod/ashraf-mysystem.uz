import { Table } from "antd";
import React, { memo, useEffect, useMemo, useState } from "react";
import MainEmptyTable from "../../common/errors/empty/table/MainEmptyTable";

function MainDataTableBody({
  columns,
  data,
  isLoading,
  isError,
  refetch,
  pageSize,
  mobile,
  search,
  expandableTable,
  scroll,
  pagination,
  rowKey,
  rowClassName,
  expandableTableRowClassName,
  expandableTableCurrent,
}) {
  /* State */
  const [tableColumns, setTableColumns] = useState([]);

  useEffect(() => {
    const newColumn = columns?.map((item) => {
      if (item?.expand) {
        return Table.EXPAND_COLUMN;
      }
      if (item?.sortType && item?.key !== "operation" && !item?.expand) {
        return {
          ...item,
          key: item?.dataIndex,

          // Sort operation
          sorter: (a, b) => {
            if (!a[item?.dataIndex]) return;
            switch (item?.sortType) {
              case "number":
                return a[item?.dataIndex] - b[item?.dataIndex];
              case "string":
                return a[item?.dataIndex].length - b[item?.dataIndex].length;
              case "date":
                return (
                  new Date(a[item?.dataIndex]) - new Date(b[item?.dataIndex])
                );
              default:
                throw new Error('"sortType" incorrect value for sort table!');
            }
          },
        };
      }

      return {
        ...item,
      };
    });
    setTableColumns([...newColumn]);
  }, [columns]);

  const filterTableData = useMemo(() => {
    return data.filter((item) => {
      return search?.toLowerCase() === ""
        ? item
        : Object?.keys(item)?.find((key) => {
            if (
              typeof item[key] === "string" ||
              typeof item[key] === "number"
            ) {
              const value = item[key].toString();
              /* Success */
              return value?.toLowerCase()?.includes(search?.toLowerCase());
            }
            /* Error */
            return null;
          });
    });
  }, [search, JSON.stringify(data)]);

  return (
    <Table
      size={mobile ? "small" : null}
      columns={tableColumns}
      dataSource={filterTableData}
      loading={isLoading}
      scroll={
        scroll
          ? scroll
          : scroll === "disable"
          ? false
          : {
              x: 800,
              y: 500,
            }
      }
      locale={{
        emptyText: () => (
          <MainEmptyTable
            refetchStatus={isError && !isLoading}
            onRefetch={refetch}
          />
        ),
      }}
      pagination={
        pagination
          ? {
              pageSize: pageSize,
            }
          : false
      }
      expandable={
        expandableTable || expandableTableCurrent
          ? {
              expandedRowRender: (record) => {
                if (expandableTableCurrent) {
                  if (expandableTableCurrent?.expandedRowRender) {
                    return expandableTableCurrent?.expandedRowRender(record);
                  }
                } else {
                  return (
                    <Table
                      size="small"
                      columns={expandableTable?.columns}
                      dataSource={record[expandableTable?.name]}
                      rowKey={expandableTable?.rowKey || "id"}
                      pagination={false}
                      rowClassName={expandableTableRowClassName}
                    />
                  );
                }
              },
            }
          : null
      }
      rowClassName={rowClassName}
      rowKey={rowKey || "id"}
    />
  );
}

export default memo(MainDataTableBody);

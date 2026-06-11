import React, { useMemo } from "react";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import data from "../../../data/data.json";
import ExportTable from "../../../components/common/exportTable/ExportTable";

function CashierAttendanceHistory() {
  // State

  // Api

  // Memo
  const tableData = useMemo(() => {
    if (data.cashier.attendance.all_history) {
      return data.cashier.attendance.all_history;
    }
    return [];
  }, []);

  // Columns
  const columns = [
    {
      title: "Nomi",
      dataIndex: "name",
      sortType: "string",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];
  return (
    <MainDataTable
      // isLoading={isLoading}
      // isError={isError}
      // refetch={refetch}
      columns={columns}
      data={tableData}
      customHeader={
        <ExportTable columns={columns} fileName="Bo'limlar" data={tableData} />
      }
    />
  );
}

export default CashierAttendanceHistory;

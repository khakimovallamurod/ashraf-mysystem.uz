import React, { useMemo } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetAdminDepartmentQuery } from "../../../features/admin/department/adminDepartmentApiSlice";

function CashierAttendanceAlwaysLate() {
  /* API */
  const { data, isLoading, isError, refetch } = useGetAdminDepartmentQuery();

  const departmentData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      sortType: "number",
    },
    {
      title: "Nomi",
      dataIndex: "name",
      width: 150,
      sortType: "string",
    },
  ];

  return (
    <MainDataTable
      columns={columns}
      isLoading={isLoading}
      isError={isError}
      data={departmentData}
      customHeader={
        <ExportTable
          columns={columns}
          fileName="Bo'limlar"
          data={[...departmentData]}
        />
      }
      refetch={refetch}
    />
  );
}

export default CashierAttendanceAlwaysLate;

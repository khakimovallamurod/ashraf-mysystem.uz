import React, { useMemo } from "react";
import ExportTable from "../../../../components/common/exportTable/ExportTable";
import MainDataTable from "../../../../components/ui/dataTable/MainDataTable";
import { useGetAdminProductsQuery } from "../../../../features/admin/product/adminProductApiSlice";

function AdminProductTable() {
  /* API */
  const { data, isLoading, isError, refetch } = useGetAdminProductsQuery();

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
    {
      title: "Article",
      dataIndex: "article",
      width: 150,
      sortType: "string",
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
      width: 150,
      sortType: "string",
    },
    {
      title: "Massasi(kg)",
      dataIndex: "soni",
      width: 150,
      sortType: "number",
    },
    {
      title: "Narx",
      dataIndex: "price",
      width: 150,
      sortType: "number",
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

export default AdminProductTable;

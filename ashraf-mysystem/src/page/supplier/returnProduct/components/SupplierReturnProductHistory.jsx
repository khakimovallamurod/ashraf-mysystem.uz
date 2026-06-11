import React, { useMemo } from "react";
import MainDataTable from "../../../../components/ui/dataTable/MainDataTable";
import { useGetSupplierReturnProductHistoryQuery } from "../../../../features/supplier/returnProduct/supplierReturnProductApiSlice";
import MainNumberFormat from "../../../../components/common/numberFormat/MainNumberFormat";

function SupplierReturnProductHistory() {
  /* API */
  const { data, isLoading, isError, refetch } =
    useGetSupplierReturnProductHistoryQuery();

  /* Memo */
  const tableData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sortType: "number",
    },
    {
      title: "Mahsulot nomi",
      dataIndex: "product",
      key: "product",
      width: 150,
      sortType: "string",
    },
    {
      title: "Massa",
      dataIndex: "massa",
      key: "massa",
      width: 150,
      sortType: "number",
      render: (_, { massa }) => <MainNumberFormat value={massa} />,
    },
    {
      title: "Narxi (so'm)",
      dataIndex: "narx",
      key: "narx",
      width: 150,
      sortType: "number",
      render: (_, { narx }) => <MainNumberFormat value={narx} />,
    },
    {
      title: "Summa (so'm)",
      dataIndex: "summa",
      key: "summa",
      width: 150,
      sortType: "number",
      render: (_, { summa }) => <MainNumberFormat value={summa} />,
    },
    {
      title: "Mijoz nomi",
      dataIndex: "customer",
      key: "customer",
      width: 150,
      render: (_, { client }) => <>{client?.fio}</>,
    },
    {
      title: "Mijoz telefoni",
      key: "telefon",
      width: 150,
      render: (_, { client }) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            fontSize: 11,
          }}
        >
          <a href={`tel:${client?.telefon}`}>{client?.telefon}</a>
          <a href={`tel:${client?.telefon2}`}>{client?.telefon2}</a>
          <a href={`tel:${client?.telefon3}`}>{client?.telefon3}</a>
        </div>
      ),
    },
  ];

  return (
    <MainDataTable
      columns={columns}
      isLoading={isLoading}
      isError={isError}
      data={tableData}
      refetch={refetch}
    />
  );
}

export default SupplierReturnProductHistory;

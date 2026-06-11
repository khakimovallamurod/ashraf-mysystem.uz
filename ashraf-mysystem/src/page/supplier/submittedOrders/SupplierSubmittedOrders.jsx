import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import React, { useMemo } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetSupplierSubmittedOrderQuery } from "../../../features/supplier/supplierApiSlice";

function SupplierSubmittedOrders() {
  /* API */
  const { data, isLoading, isError, refetch } =
    useGetSupplierSubmittedOrderQuery();

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
      title: "Sotuvchi",
      dataIndex: "sotuvchi",
      key: "sotuvchi",
      width: 100,
      sortType: "string",
    },
    {
      title: "Mijoz nomi",
      dataIndex: "customer",
      key: "customer",
      width: 100,
      render: (_, { client }) => <>{client?.fio}</>,
    },
    {
      title: "Korxona",
      dataIndex: "customer",
      key: "customer",
      width: 100,
      render: (_, { client }) => <>{client?.korxona}</>,
    },
    {
      title: "Mijoz manzili",
      dataIndex: "customer",
      key: "customer",
      width: 100,
      render: (_, { client }) => <>{client?.manzil}</>,
    },
    {
      title: "Mijoz telefoni",
      key: "telefon",
      width: 100,
      render: (_, { client }) => (
        <div>
          <a href={`tel:${client?.telefon}`}>{client?.telefon}</a>
        </div>
      ),
    },
    {
      title: "Sana",
      dataIndex: "vaqt",
      key: "vaqt",
      width: 100,
      sortType: "string",
    }, 
  ];
  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ marginTop: "2rem" }}>
        <MainDataTable 
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={[...tableData]}
          refetch={refetch}
          scroll={{x: 600}}
        />
      </div>
    </div>
  );
}

export default SupplierSubmittedOrders;

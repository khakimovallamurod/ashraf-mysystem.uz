import { CheckOutlined } from "@ant-design/icons";
import { Button, Tooltip, Tag } from "antd";
import React, { useMemo, useRef } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetUploaderReturnProductsQuery } from "../../../features/uploader/returnProducts/uploaderReturnProductsApiSlice";
import UploaderReturnProductPutPolkaModal from "./components/UploaderReturnProductPutPolkaModal";

function UploaderReturnProducts() {
  /* Ref */
  const polkaModalRef = useRef(null);

  /* API */
  const { data, isLoading, isError, refetch } =
    useGetUploaderReturnProductsQuery();

  /* Memo */
  const tableData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  /* Modal */
  const handleOpenSetPolkaModal = (returnItemId) => {
    polkaModalRef.current?.onOpen(returnItemId);
  };

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
      title: "Holat",
      dataIndex: "holat",
      width: 150,
      render: (holat) => (
        <Tag color={holat === "vozvrat" ? "red" : "green"}>{holat}</Tag>
      ),
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
    {
      title: "Amal",
      key: "operation",
      width: 80,
      fixed: "right",
      align: "center",
      render: (_, { id }) => (
        <Tooltip title="Tasdiqlash">
          <Button
            icon={<CheckOutlined />}
            type="primary"
            size="small"
            shape="round"
            onClick={() => handleOpenSetPolkaModal(id)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      {/* Modal */}
      <UploaderReturnProductPutPolkaModal ref={polkaModalRef} />

      <div style={{ padding: "0 10px" }}>
        <MainDataTable
          mobile={true}
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={tableData}
          refetch={refetch}
        />
      </div>
    </>
  );
}

export default UploaderReturnProducts;

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Popconfirm, Table, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import MainNumberFormat from "../../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../../components/common/section/Section";
import MainDataTable from "../../../../components/ui/dataTable/MainDataTable";
import {
  useDeleteSupplierReturnProductMutation,
  useGetSupplierReturnProductQuery,
} from "../../../../features/supplier/returnProduct/supplierReturnProductApiSlice";
import SupplierReturnProductAddModal from "./SupplierReturnProductAddModal";

function SupplierReturnProductAdd() {
  /* State */
  const addReturnProductModal = useRef(null);
  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [polkaTableData, setPolkaTableData] = useState([]);

  /* API */
  const { data, isLoading, isError, refetch } =
    useGetSupplierReturnProductQuery();
  const [deleteData] = useDeleteSupplierReturnProductMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "delete";

  useEffect(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      setPolkaTableData(data?.data);
    } else {
      setPolkaTableData([]);
    }
  }, [data]);

  /* DELETE */
  const handleDeleteItem = async (id) => {
    setIsSubmitting(true);

    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const resData = await deleteData(id).unwrap();
      if (resData?.success === true) {
        if (resData?.message) {
          messageApi.open({
            key,
            type: "success",
            content: resData?.message,
          });
        }
      } else if (resData?.success === false) {
        if (resData?.message) {
          messageApi.open({
            key,
            type: "error",
            content: resData?.message,
          });
        }
      }
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        message.warning("Ulanishda xatolik! Qaytadan urinib ko'ring!");
      }
    } finally {
      setIsSubmitting(false);
    }
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
      width: 50,
      fixed: "right",
      align: "center",
      render: ({ id }) => (
        <Popconfirm
          title="O'chirish"
          description="Rostdan ham o'chirmoqchimisiz?"
          onConfirm={() => handleDeleteItem(id)}
          okText="Ha, albatta"
          cancelText="Yo'q"
        >
          <Button
            icon={<DeleteOutlined />}
            type="primary"
            size="small"
            shape="round"
            danger
          />
        </Popconfirm>
      ),
    },
  ];

  /* MODAL */
  const handleOpenAddPolkaModal = () => addReturnProductModal.current.onOpen();

  return (
    <>
      {contextHolder}

      <SupplierReturnProductAddModal ref={addReturnProductModal} />

      <Section>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
            gap: "0.5rem",
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenAddPolkaModal}
          >
            Mahsulotni qaytarish
          </Button>
        </div>

        <Divider />

        <MainDataTable
          mobile={true}
          columns={columns}
          isLoading={isLoading || isSubmitting}
          isError={isError}
          data={polkaTableData}
          refetch={refetch}
        />
      </Section>
    </>
  );
}

export default SupplierReturnProductAdd;

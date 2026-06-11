import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Popconfirm, message } from "antd";
import React, { useMemo, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainModal from "../../../components/common/modal/MainModal";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import {
  useDeleteAdminSupplierMgmtMutation,
  useGetAdminSupplierMgmtQuery,
} from "../../../features/admin/supplierManagement/adminSupplierManagementApiSlice";
import useExportToExcel from "../../../hooks/exportTable/useExportToExcel";
import AdminAddSupplierModal from "./components/AdminAddSupplierModal";

function AdminSupplierManagement() {
  const [openModal, setOpenModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const { data, isLoading, isError, refetch } = useGetAdminSupplierMgmtQuery();
  const [deleteSupplier] = useDeleteAdminSupplierMgmtMutation();

  const [messageApi, contextHolder] = message.useMessage();
  const key = "delete";
  const [onExportToExcel] = useExportToExcel();

  const handleDelete = async (id) => {
    messageApi.open({ key, type: "loading", content: "Loading..." });
    try {
      const resData = await deleteSupplier(id).unwrap();
      if (resData?.success === true) {
        messageApi.open({ key, type: "success", content: resData?.message });
      } else {
        messageApi.open({ key, type: "error", content: resData?.message });
      }
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        message.warning("Ulanishda xatolik! Qaytadan urinib ko'ring!");
      }
    }
  };

  const tableData = useMemo(() => {
    if (data?.success === true && Array.isArray(data?.data)) {
      return data.data.map((item) => ({
        id: item?.id,
        name: item?.name || item?.fio || "",
        phone: item?.phone || item?.telefon || "",
        chatId: item?.telegram_id || item?.chat_id || "",
        balance: item?.balans || "0",
      }));
    }
    return [];
  }, [data]);

  const columns = [
    { title: "ID", dataIndex: "id", width: 70, sortType: "number" },
    { title: "Ismi", dataIndex: "name", width: 180, sortType: "string" },
    { title: "Telefon", dataIndex: "phone", width: 150, sortType: "string" },
    { title: "Telegram chat id", dataIndex: "chatId", width: 180, sortType: "string" },
    { title: "Balans", dataIndex: "balance", width: 120, sortType: "number" },
    {
      title: "Amal",
      dataIndex: "operation",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Button
            icon={<EditOutlined />}
            type="default"
            size="small"
            onClick={() => {
              setEditingSupplier(record);
              setOpenModal(true);
            }}
          />
          <Popconfirm
            title="O'chirish"
            description="Rostdan ham o'chirmoqchimisiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha, albatta"
            cancelText="Yo'q"
          >
            <Button icon={<DeleteOutlined />} type="primary" size="small" danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleExportExcel = () => {
    onExportToExcel({ columns, data: tableData });
  };

  return (
    <>
      {contextHolder}
      <MainModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingSupplier(null);
        }}
      >
        <AdminAddSupplierModal
          supplier={editingSupplier}
          onClose={() => {
            setOpenModal(false);
            setEditingSupplier(null);
          }}
        />
      </MainModal>
      <Section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
            gap: "1rem",
          }}
        >
          <Button type="primary" icon={<UploadOutlined />} onClick={handleExportExcel}>
            Excel
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingSupplier(null);
              setOpenModal(true);
            }}
          >
            Ta'minotchi qo'shish
          </Button>
        </div>
        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={tableData}
          customHeader={
            <ExportTable columns={columns} fileName="Ta'minotchilar" data={[...tableData]} />
          }
          refetch={refetch}
        />
      </Section>
    </>
  );
}

export default AdminSupplierManagement;

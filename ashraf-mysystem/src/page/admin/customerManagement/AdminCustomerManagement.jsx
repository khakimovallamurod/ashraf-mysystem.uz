import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Tag, message } from "antd";
import React, { useMemo, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainModal from "../../../components/common/modal/MainModal";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import {
  useDeleteAdminCustomerMgmtMutation,
  useGetAdminCustomerMgmtQuery,
} from "../../../features/admin/customerManagement/adminCustomerManagementApiSlice";
import useExportToExcel from "../../../hooks/exportTable/useExportToExcel";
import AdminAddCustomerModal from "./components/AdminAddCustomerModal";

function AdminCustomerManagement() {
  const [openModal, setOpenModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const { data, isLoading, isError, refetch } = useGetAdminCustomerMgmtQuery();
  const [deleteCustomer] = useDeleteAdminCustomerMgmtMutation();
  const [onExportToExcel] = useExportToExcel();
  const [messageApi, contextHolder] = message.useMessage();
  const key = "deleteCustomer";

  const tableData = useMemo(() => {
    if (data?.success === true && Array.isArray(data?.data)) {
      return data.data.map((item) => ({
        id: item?.id,
        name: item?.name || item?.fio || "",
        phone: item?.phone || item?.telefon || "",
        address: item?.address || item?.manzil || "",
        qarz: item?.qarz ?? item?.balans ?? 0,
      }));
    }
    return [];
  }, [data]);

  const columns = [
    { title: "ID", dataIndex: "id", width: 70, sortType: "number" },
    { title: "Ismi", dataIndex: "name", width: 180, sortType: "string" },
    { title: "Telefon", dataIndex: "phone", width: 150, sortType: "string" },
    { title: "Manzil", dataIndex: "address", width: 200, sortType: "string" },
    {
      title: "Qarz",
      dataIndex: "qarz",
      width: 130,
      sortType: "number",
      render: (v) => (
        <Tag color={Number(v) > 0 ? "red" : "green"}>
          {Number(v).toLocaleString("uz-UZ")}
        </Tag>
      ),
    },
    {
      title: "Amallar",
      dataIndex: "operation",
      width: 120,
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Button
            icon={<EditOutlined />}
            type="default"
            size="small"
            onClick={() => {
              setEditingCustomer(record);
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

  const handleDelete = async (id) => {
    messageApi.open({ key, type: "loading", content: "Loading..." });
    try {
      const resData = await deleteCustomer(id).unwrap();
      messageApi.open({
        key,
        type: resData?.success ? "success" : "error",
        content: resData?.message || "Amal bajarilmadi",
      });
    } catch (err) {
      messageApi.open({
        key,
        type: "warning",
        content: err?.data?.message || "Ulanishda xatolik! Qaytadan urinib ko'ring!",
      });
    }
  };

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
          setEditingCustomer(null);
        }}
      >
        <AdminAddCustomerModal
          customer={editingCustomer}
          onClose={() => {
            setOpenModal(false);
            setEditingCustomer(null);
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
              setEditingCustomer(null);
              setOpenModal(true);
            }}
          >
            Mijoz qo'shish
          </Button>
        </div>
        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={tableData}
          scroll={{ x: 1000, y: 500 }}
          rowKey="id"
          customHeader={
            <ExportTable columns={columns} fileName="Mijozlar" data={[...tableData]} />
          }
          refetch={refetch}
        />
      </Section>
    </>
  );
}

export default AdminCustomerManagement;

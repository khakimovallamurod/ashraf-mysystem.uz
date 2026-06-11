import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useMemo, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainModal from "../../../components/common/modal/MainModal";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetAdminWarehouseTransferQuery } from "../../../features/admin/warehouseManagement/adminWarehouseManagementApiSlice";
import useExportToExcel from "../../../hooks/exportTable/useExportToExcel";
import AdminTransferModal from "./components/AdminTransferModal";

function AdminWarehouseTransfer() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ start: "", end: "" });

  const { data, isLoading, isError, refetch } = useGetAdminWarehouseTransferQuery(selectedDate);
  const [onExportToExcel] = useExportToExcel();

  const tableData = useMemo(() => {
    if (data?.success === true && Array.isArray(data?.data)) {
      return data.data.map((item) => ({
        id: item?.id,
        product_name: item?.product || item?.product_name || "",
        massa: item?.massa || 0,
        xolodilnik_id: item?.partiya_id || "",
        sana: item?.vaqt || item?.partiya_kun || "",
        izoh: item?.javobgar || "",
      }));
    }
    return [];
  }, [data]);

  const columns = [
    { title: "ID", dataIndex: "id", width: 70, sortType: "number" },
    { title: "Mahsulot", dataIndex: "product_name", width: 180, sortType: "string" },
    {
      title: "Massa (kg)",
      dataIndex: "massa",
      width: 130,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    { title: "Xolodilnik", dataIndex: "xolodilnik_id", width: 130, sortType: "string" },
    { title: "Sana", dataIndex: "sana", width: 120, sortType: "string" },
    { title: "Izoh", dataIndex: "izoh", width: 200 },
  ];

  const handleExportExcel = () => {
    onExportToExcel({ columns, data: tableData });
  };

  return (
    <>
      <MainModal open={openModal} onClose={() => setOpenModal(false)}>
        <AdminTransferModal onClose={() => setOpenModal(false)} />
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
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenModal(true)}>
            Xolodilnikka o'tkazish
          </Button>
        </div>
        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={tableData}
          showDatePicker={true}
          setDateValue={setSelectedDate}
          customHeader={
            <ExportTable columns={columns} fileName="Xolodilnik_otkazmalar" data={[...tableData]} />
          }
          refetch={refetch}
        />
      </Section>
    </>
  );
}

export default AdminWarehouseTransfer;

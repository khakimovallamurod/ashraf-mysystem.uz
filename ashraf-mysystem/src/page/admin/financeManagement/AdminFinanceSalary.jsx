import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Tag } from "antd";
import React, { useMemo, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainModal from "../../../components/common/modal/MainModal";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import {
  useGetAdminFinanceSalaryQuery,
} from "../../../features/admin/financeManagement/adminFinanceManagementApiSlice";
import { useGetCashierWorkerQuery } from "../../../features/cashier/salary/cashierSalaryApiSlice";
import useExportToExcel from "../../../hooks/exportTable/useExportToExcel";
import AdminAddWorkerModal from "../worker/components/AdminAddWorkerModal";
import AdminSalaryModal from "./components/AdminSalaryModal";

function AdminFinanceSalary() {
  const [openModal, setOpenModal] = useState(false);
  const [openWorkerModal, setOpenWorkerModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ start: "", end: "" });

  const { data, isLoading, isError, refetch } = useGetAdminFinanceSalaryQuery(selectedDate);
  const { data: workersData } = useGetCashierWorkerQuery();
  const [onExportToExcel] = useExportToExcel();

  const tableData = useMemo(() => {
    if (data?.success === true && Array.isArray(data?.data?.list)) {
      return data.data.list.map((item) => ({
        id: item?.id,
        worker_name: item?.worker || "",
        bulim: "",
        worker_type: "worker",
        summa: item?.summa || 0,
        oy: item?.oy || "",
        sana: item?.vaqt || "",
        izoh: item?.izoh || "",
      }));
    }
    return [];
  }, [data]);

  const workers = useMemo(() => {
    if (workersData?.success === true && Array.isArray(workersData?.data)) {
      return workersData.data.map((item) => ({
        ...item,
        name: item?.fio || item?.name || "",
      }));
    }
    return [];
  }, [workersData]);

  const columns = [
    { title: "ID", dataIndex: "id", width: 70, sortType: "number" },
    { title: "Ishchi", dataIndex: "worker_name", width: 180, sortType: "string" },
    { title: "Bo'lim", dataIndex: "bulim", width: 150, sortType: "string" },
    {
      title: "Tur",
      dataIndex: "worker_type",
      width: 100,
      render: (v) => (
        <Tag color={v === "qassob" ? "orange" : "blue"}>{v === "qassob" ? "Qassob" : "Ishchi"}</Tag>
      ),
    },
    {
      title: "Summa",
      dataIndex: "summa",
      width: 140,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    { title: "Oy", dataIndex: "oy", width: 110, sortType: "string" },
    { title: "Sana", dataIndex: "sana", width: 120, sortType: "string" },
    { title: "Izoh", dataIndex: "izoh", width: 200 },
  ];

  const handleExportExcel = () => {
    onExportToExcel({ columns, data: tableData });
  };

  return (
    <>
      <MainModal open={openModal} onClose={() => setOpenModal(false)}>
        <AdminSalaryModal workers={workers} onClose={() => setOpenModal(false)} />
      </MainModal>
      <MainModal open={openWorkerModal} onClose={() => setOpenWorkerModal(false)}>
        <AdminAddWorkerModal />
      </MainModal>
      <Section>
        <Row gutter={[12, 12]} style={{ marginBottom: "1rem" }}>
          <Col xs={24} sm={12} lg={4}>
            <Button type="primary" icon={<UploadOutlined />} onClick={handleExportExcel} block>
              Excel
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenModal(true)} block>
              Ish haqi to'lash
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Button onClick={() => setOpenWorkerModal(true)} block>
              Ishchi qo'shish
            </Button>
          </Col>
        </Row>
        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={tableData}
          showDatePicker={true}
          setDateValue={setSelectedDate}
          customHeader={
            <ExportTable columns={columns} fileName="Ish_haqi_hisobot" data={[...tableData]} />
          }
          refetch={refetch}
        />
      </Section>
    </>
  );
}

export default AdminFinanceSalary;

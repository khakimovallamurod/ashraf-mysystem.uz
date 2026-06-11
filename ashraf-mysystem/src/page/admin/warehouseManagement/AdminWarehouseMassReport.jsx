import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import React, { useMemo, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetAdminWarehouseMassReportQuery } from "../../../features/admin/warehouseManagement/adminWarehouseManagementApiSlice";
import useExportToExcel from "../../../hooks/exportTable/useExportToExcel";

function AdminWarehouseMassReport() {
  const [selectedDate, setSelectedDate] = useState({ start: "", end: "" });

  const { data, isLoading, isError, refetch } = useGetAdminWarehouseMassReportQuery(selectedDate);
  const [onExportToExcel] = useExportToExcel();

  const tableData = useMemo(() => {
    if (data?.success === true && Array.isArray(data?.data)) {
      return data.data.map((item) => ({
        id: item?.id,
        product_name: item?.sana || `Partiya ${item?.id}`,
        krim_massa: item?.krim_massa || 0,
        chiqim_massa: Number(item?.sotuv_massa || 0) + Number(item?.xolodelnik_massa || 0),
        qoldiq: Number(item?.krim_massa || 0) - Number(item?.sotuv_massa || 0) - Number(item?.xolodelnik_massa || 0),
        maydalangan: item?.foiz || 0,
      }));
    }
    return [];
  }, [data]);

  const columns = [
    { title: "ID", dataIndex: "id", width: 70, sortType: "number" },
    { title: "Mahsulot", dataIndex: "product_name", width: 180, sortType: "string" },
    {
      title: "Kirgan massa (kg)",
      dataIndex: "krim_massa",
      width: 150,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "Chiqgan massa (kg)",
      dataIndex: "chiqim_massa",
      width: 160,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "Qoldiq (kg)",
      dataIndex: "qoldiq",
      width: 130,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "Maydalangan (kg)",
      dataIndex: "maydalangan",
      width: 150,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
  ];

  const handleExportExcel = () => {
    onExportToExcel({ columns, data: tableData });
  };

  return (
    <Section>
      <Row gutter={[12, 12]} style={{ marginBottom: "1rem" }}>
        <Col xs={24} sm={6} lg={4}>
          <Button type="primary" icon={<UploadOutlined />} onClick={handleExportExcel} block>
            Excel
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
          <ExportTable columns={columns} fileName="Massa_hisobot" data={[...tableData]} />
        }
        refetch={refetch}
      />
    </Section>
  );
}

export default AdminWarehouseMassReport;

import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Tag } from "antd";
import React, { useMemo, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetAdminFinanceDebtsQuery } from "../../../features/admin/financeManagement/adminFinanceManagementApiSlice";
import useExportToExcel from "../../../hooks/exportTable/useExportToExcel";

function AdminFinanceDebts() {
  const [selectedDate, setSelectedDate] = useState({ start: "", end: "" });

  const { data, isLoading, isError, refetch } = useGetAdminFinanceDebtsQuery(selectedDate);
  const [onExportToExcel] = useExportToExcel();

  const tableData = useMemo(() => {
    if (data?.success === true && Array.isArray(data?.data?.list)) {
      return data.data.list.map((item, index) => ({
        id: index + 1,
        ism: item?.client || item?.dostavchik || "",
        tur: "mijoz",
        qarz: item?.summa || 0,
        tolangan: Number(item?.naqdsum || 0) + Number(item?.bank || 0) + Number(item?.karta || 0),
        qoldiq: item?.summa || 0,
        sana: item?.vaqt || "",
        izoh: "Qarzdan tushgan to'lov",
      }));
    }
    return [];
  }, [data]);

  const columns = [
    { title: "ID", dataIndex: "id", width: 70, sortType: "number" },
    { title: "Mijoz / Ta'minotchi", dataIndex: "ism", width: 180, sortType: "string" },
    { title: "Tur", dataIndex: "tur", width: 120,
      render: (v) => <Tag color={v === "mijoz" ? "blue" : "orange"}>{v}</Tag>
    },
    {
      title: "Qarz miqdori",
      dataIndex: "qarz",
      width: 150,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "To'langan",
      dataIndex: "tolangan",
      width: 140,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "Qoldiq",
      dataIndex: "qoldiq",
      width: 130,
      sortType: "number",
      render: (v) => (
        <Tag color={Number(v) > 0 ? "red" : "green"}>
          <MainNumberFormat value={v} />
        </Tag>
      ),
    },
    { title: "Sana", dataIndex: "sana", width: 120, sortType: "string" },
    { title: "Izoh", dataIndex: "izoh", width: 200 },
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
          <ExportTable columns={columns} fileName="Olingan_qarzlar" data={[...tableData]} />
        }
        refetch={refetch}
      />
    </Section>
  );
}

export default AdminFinanceDebts;

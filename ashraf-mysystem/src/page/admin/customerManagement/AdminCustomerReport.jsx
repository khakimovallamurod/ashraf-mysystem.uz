import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select } from "antd";
import React, { useMemo, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import {
  useGetAdminCustomerMgmtQuery,
  useGetAdminCustomerMgmtReportQuery,
} from "../../../features/admin/customerManagement/adminCustomerManagementApiSlice";
import useExportToExcel from "../../../hooks/exportTable/useExportToExcel";

function AdminCustomerReport() {
  const [selectedDate, setSelectedDate] = useState({ start: "", end: "" });
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const { data: customersData, isLoading: customersLoading } = useGetAdminCustomerMgmtQuery();
  const { data, isLoading, isError, refetch } = useGetAdminCustomerMgmtReportQuery(
    { customerId: selectedCustomer || 0, ...selectedDate },
    { skip: !selectedCustomer }
  );

  const [onExportToExcel] = useExportToExcel();

  const customerOptions = useMemo(() => {
    if (customersData?.success === true && Array.isArray(customersData?.data)) {
      return customersData.data.map((item) => ({
        id: item?.id,
        name: item?.name || item?.fio || "",
      }));
    }
    return [];
  }, [customersData]);

  const tableData = useMemo(() => {
    if (data?.success === true && Array.isArray(data?.data?.akt)) {
      return data.data.akt.map((item) => ({
        id: item?.id,
        product_name: item?.status || "harakat",
        miqdor: item?.vozvrat || item?.summa || 0,
        price: item?.debit || item?.kredit || 0,
        summa: item?.summa || 0,
        paid: item?.kredit || 0,
        qarz: item?.debit || 0,
        sana: item?.date || "",
      }));
    }
    return [];
  }, [data]);

  const columns = [
    { title: "ID", dataIndex: "id", width: 70, sortType: "number" },
    { title: "Mahsulot", dataIndex: "product_name", width: 180, sortType: "string" },
    {
      title: "Miqdor",
      dataIndex: "miqdor",
      width: 120,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "Narxi",
      dataIndex: "price",
      width: 130,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "Summa",
      dataIndex: "summa",
      width: 140,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "To'langan",
      dataIndex: "paid",
      width: 130,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "Qarz",
      dataIndex: "qarz",
      width: 120,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    { title: "Sana", dataIndex: "sana", width: 120, sortType: "string" },
  ];

  const handleExportExcel = () => {
    onExportToExcel({ columns, data: tableData });
  };

  return (
    <Section>
      <Row gutter={[12, 12]} style={{ marginBottom: "1rem" }}>
        <Col xs={24} sm={12} lg={8}>
          <Select
            style={{ width: "100%" }}
            placeholder="Mijozni tanlang"
            allowClear
            showSearch
            loading={customersLoading}
            onChange={(val) => setSelectedCustomer(val)}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {customerOptions.map((c) => (
              <Select.Option value={c.id} key={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} lg={4}>
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
          <ExportTable columns={columns} fileName="Mijoz_hisobot" data={[...tableData]} />
        }
        refetch={refetch}
      />
    </Section>
  );
}

export default AdminCustomerReport;

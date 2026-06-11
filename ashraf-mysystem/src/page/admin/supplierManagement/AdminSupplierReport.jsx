import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select } from "antd";
import React, { useMemo, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import {
  useGetAdminSupplierMgmtQuery,
  useGetAdminSupplierMgmtReportQuery,
} from "../../../features/admin/supplierManagement/adminSupplierManagementApiSlice";
import useExportToExcel from "../../../hooks/exportTable/useExportToExcel";

function AdminSupplierReport() {
  const [selectedDate, setSelectedDate] = useState({ start: "", end: "" });
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const { data: suppliersData, isLoading: suppliersLoading } = useGetAdminSupplierMgmtQuery();
  const { data, isLoading, isError, refetch } = useGetAdminSupplierMgmtReportQuery(
    { supplierId: selectedSupplier || 0, ...selectedDate },
    { skip: !selectedSupplier }
  );

  const [onExportToExcel] = useExportToExcel();

  const supplierOptions = useMemo(() => {
    if (suppliersData?.success === true && Array.isArray(suppliersData?.data)) {
      return suppliersData.data.map((item) => ({
        id: item?.id,
        name: item?.name || item?.fio || "",
      }));
    }
    return [];
  }, [suppliersData]);

  const tableData = useMemo(() => {
    if (data?.success === true && Array.isArray(data?.data?.akt)) {
      return data.data.akt.map((item, index) => ({
        id: item?.id || index + 1,
        product_name: item?.status || "harakat",
        massa: item?.massa || item?.dona || 0,
        price: item?.kredit || item?.debit || 0,
        summa: item?.summa || 0,
        sana: item?.date || item?.vaqt || "",
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
            placeholder="Ta'minotchini tanlang"
            allowClear
            showSearch
            loading={suppliersLoading}
            onChange={(val) => setSelectedSupplier(val)}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {supplierOptions.map((s) => (
              <Select.Option value={s.id} key={s.id}>
                {s.name}
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
          <ExportTable columns={columns} fileName="Taminotchi_hisobot" data={[...tableData]} />
        }
        refetch={refetch}
      />
    </Section>
  );
}

export default AdminSupplierReport;

import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select } from "antd";
import React, { useMemo, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetAdminExpensesCategoryQuery } from "../../../features/admin/expensesCategory/adminExpensesCategoryApiSlice";
import { useGetCashierExpensesByDateQuery } from "../../../features/cashier/expenses/cashierExpensesApiSlice";
import useExportToExcel from "../../../hooks/exportTable/useExportToExcel";

function AdminFinanceExpenses() {
  const [selectedDate, setSelectedDate] = useState({ start: "", end: "" });
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data: categoryData, isLoading: categoryLoading } = useGetAdminExpensesCategoryQuery();
  const { data, isLoading, isError, refetch } = useGetCashierExpensesByDateQuery({
    start: selectedDate.start,
    end: selectedDate.end,
    expenseCategory: selectedCategory,
  });

  const [onExportToExcel] = useExportToExcel();

  const categoryOptions = useMemo(() => {
    if (categoryData?.success === true && Array.isArray(categoryData?.data)) {
      return categoryData.data;
    }
    return [];
  }, [categoryData]);

  const tableData = useMemo(() => {
    if (data?.success === true) {
      if (Array.isArray(data?.data?.list)) return data.data.list;
      if (Array.isArray(data?.data)) return data.data;
    }
    return [];
  }, [data]);

  const columns = [
    { title: "ID", dataIndex: "id", width: 70, sortType: "number" },
    { title: "Javobgar", dataIndex: "javobgar", width: 180, sortType: "string" },
    { title: "Xarajat turi", dataIndex: "turi", width: 160, sortType: "string" },
    {
      title: "Naqd so'm",
      dataIndex: "naqdsum",
      width: 140,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "Naqd USD",
      dataIndex: "naqdusd",
      width: 130,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "Bank",
      dataIndex: "bank",
      width: 120,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "Karta",
      dataIndex: "karta",
      width: 120,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    { title: "Sana", dataIndex: "vaqt", width: 120, sortType: "string" },
    { title: "Izoh", dataIndex: "izoh", width: 200 },
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
            placeholder="Xarajat turini tanlang"
            allowClear
            showSearch
            loading={categoryLoading}
            onChange={(val) => setSelectedCategory(val || null)}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {categoryOptions.map((c) => (
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
          <ExportTable columns={columns} fileName="Xarajatlar_hisobot" data={[...tableData]} />
        }
        refetch={refetch}
      />
    </Section>
  );
}

export default AdminFinanceExpenses;

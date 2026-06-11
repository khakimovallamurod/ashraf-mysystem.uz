import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import React, { useMemo, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainTableCard from "../../../components/common/mainTableCard/MainTableCard";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetAdminSupplierMgmtAllReportQuery } from "../../../features/admin/supplierManagement/adminSupplierManagementApiSlice";
import useExportToExcel from "../../../hooks/exportTable/useExportToExcel";
import formatCurrency from "../../../util/formatCurrency";

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const deriveSumma = (item) => {
  const fromApi = safeNumber(
    item?.summa ??
      item?.jami_summa ??
      item?.jamisumma ??
      item?.jami_sum ??
      item?.jamisum ??
      item?.all_summa
  );
  if (fromApi !== 0) return fromApi;

  const kredit = safeNumber(item?.jamikredit ?? item?.kredit);
  const debet = safeNumber(item?.debit);
  const vozvrat = safeNumber(item?.qaytarilgan ?? item?.vozvrat);
  return kredit - debet - vozvrat;
};

function AdminSupplierAllReport() {
  const [selectedDate, setSelectedDate] = useState({ start: "", end: "" });

  const { data, isLoading, isError, refetch } = useGetAdminSupplierMgmtAllReportQuery(selectedDate);

  const [onExportToExcel] = useExportToExcel();

  const tableData = useMemo(() => {
    if (data?.success === true && Array.isArray(data?.data?.akt)) {
      return data.data.akt.map((item, index) => ({
        id: index + 1,
        fio: item?.fio || "",
        debit: safeNumber(item?.debit),
        kredit: safeNumber(item?.jamikredit ?? item?.kredit),
        summa: deriveSumma(item),
        vozvrat: safeNumber(item?.qaytarilgan ?? item?.vozvrat),
      }));
    }
    return [];
  }, [data]);

  const totalSumma = useMemo(() => {
    const apiTotal = safeNumber(
      data?.data?.jami_summa ??
        data?.data?.jamisumma ??
        data?.data?.jami_sum ??
        data?.data?.jamisum
    );
    if (apiTotal !== 0) return apiTotal;
    return tableData.reduce((acc, row) => acc + safeNumber(row?.summa), 0);
  }, [data, tableData]);

  const columns = [
    { title: "T/r", dataIndex: "id", width: 70, sortType: "number" },
    { title: "FIO", dataIndex: "fio", width: 180, sortType: "string" },
    {
      title: "Debet",
      dataIndex: "debit",
      width: 140,
      sortType: "number",
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "Kredit",
      dataIndex: "kredit",
      width: 140,
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
      title: "Vozvrat",
      dataIndex: "vozvrat",
      width: 130,
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
        <Col xs={24} sm={12} md={8} lg={6}>
          <MainTableCard
            isLoading={isLoading}
            title={formatCurrency(safeNumber(data?.data?.jamidebit))}
            caption="Debet"
            mode="brown"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <MainTableCard
            isLoading={isLoading}
            title={formatCurrency(safeNumber(data?.data?.jamikredit))}
            caption="Kredit"
            mode="success"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <MainTableCard
            isLoading={isLoading}
            title={formatCurrency(totalSumma)}
            caption="Summa"
            mode="danger"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <MainTableCard
            isLoading={isLoading}
            title={formatCurrency(safeNumber(data?.data?.jamiqaytarilgan ?? data?.data?.jamivozvrat))}
            caption="Vozvrat"
            mode="danger"
          />
        </Col>
      </Row>
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
          <ExportTable columns={columns} fileName="Barcha_taminotchilar_hisobot" data={[...tableData]} />
        }
        refetch={refetch}
      />
    </Section>
  );
}

export default AdminSupplierAllReport;

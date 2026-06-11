import React, { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetCashierExchangeHistoryQuery } from "../../../features/cashier/balance/cashierBalanceApiSlice";

function CashierExchangeHistory() {
  /* API */
  const { data, isLoading, isError, refetch } =
    useGetCashierExchangeHistoryQuery();

  const tableData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data.map((item) => ({
        ...item,
        id: uuidv4(),
      }));
    }
    return [];
  }, [data]);

  const columns = [
    {
      title: "Javobgar",
      dataIndex: "javobgar",
      key: "javobgar",
      width: 150,
      sortType: "string",
    },
    {
      title: "Chiquvchi",
      dataIndex: "chiquvchi",
      key: "chiquvchi",
      width: 150,
      sortType: "string",
    },
    {
      title: "Kiruvchi",
      dataIndex: "kiruvchi",
      key: "kiruvchi",
      width: 150,
      sortType: "string",
    },
    {
      title: "Summa",
      dataIndex: "summa",
      key: "summa",
      width: 150,
      sortType: "number",
      render: (summa) => <MainNumberFormat value={summa} />,
    },
    {
      title: "Valyuta",
      dataIndex: "valyuta",
      key: "valyuta",
      width: 150,
      sortType: "number",
      render: (valyuta) => <MainNumberFormat value={valyuta} />,
    },
    {
      title: "Izoh",
      dataIndex: "izoh",
      key: "izoh",
      width: 300,
      sortType: "string",
    },
    {
      title: "Sana",
      dataIndex: "vaqt",
      key: "vaqt",
      width: 300,
      sortType: "date",
    },
  ];

  return (
    <>
      <Section>
        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={tableData}
          showDatePicker={false}
          pagination={true}
          pageSize={25}
          scroll={{ x: 700 }}
          refetch={refetch}
        />
      </Section>
    </>
  );
}

export default CashierExchangeHistory;

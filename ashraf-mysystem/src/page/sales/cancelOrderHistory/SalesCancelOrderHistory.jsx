import React, { useMemo, useState } from "react";
import { useGetSalesCancelOrderHistoryQuery } from "../../../features/sales/notification/salesNotificationApiSlice";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import Section from "../../../components/common/section/Section";

function SalesCancelOrderHistory() {
  /* State */
  const [selectedDate, setSelectedDate] = useState({ start: null, end: null });

  /* API */
  const { data, isLoading, isError, refetch } =
    useGetSalesCancelOrderHistoryQuery(selectedDate);

  /* Memo */
  const tableData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      sortType: "number",
    },
    {
      title: "Article",
      dataIndex: "article",
      sortType: "string",
    },
    {
      title: "client",
      dataIndex: "client",
      sortType: "string",
    },
    {
      title: "Telefon",
      dataIndex: "client_telefon",
      sortType: "string",
    },
    {
      title: "Massa",
      dataIndex: "massa",
      sortType: "number",
    },
    {
      title: "Izoh",
      dataIndex: "izoh",
      sortType: "string",
    },
    {
      title: "Sana",
      dataIndex: "vaqt",
      sortType: "date",
    },
  ];

  return (
    <Section>
      <MainDataTable
        showDatePicker={true}
        setDateValue={setSelectedDate}
        dateValue={selectedDate}
        columns={columns}
        data={[...tableData]}
      />
    </Section>
  );
}

export default SalesCancelOrderHistory;

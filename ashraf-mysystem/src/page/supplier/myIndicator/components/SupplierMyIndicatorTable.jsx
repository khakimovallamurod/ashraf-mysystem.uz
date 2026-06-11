import React, { useMemo, useState } from "react";
import ExportTable from "../../../../components/common/exportTable/ExportTable";
import MainNumberFormat from "../../../../components/common/numberFormat/MainNumberFormat";
import MainDataTable from "../../../../components/ui/dataTable/MainDataTable";
import MainRangeDatePicker from "../../../../components/ui/rangeDatePicker/MainRangeDatePicker";
import { useGetSupplierMyIndicatorQuery } from "../../../../features/supplier/myIndicator/supplierMyIndicatorApiSlice";
import { Table } from "antd";
import { formatFloatNumber } from "../../../../util/formatFloatNumber";

function SupplierMyIndicatorTable() {
  // State
  const [selectedDate, setSelectedDate] = useState({ start: null, end: null });

  // Api
  const { data, isLoading, isError, refetch, isFetching } =
    useGetSupplierMyIndicatorQuery(selectedDate);

  const [filterData, totalPrice] = useMemo(() => {
    if (
      data?.success === true &&
      data?.data &&
      data?.data?.hisobot &&
      Array.isArray(data?.data?.hisobot)
    ) {
      return [data?.data?.hisobot, data.data?.jami_maosh];
    }
    return [[], 0];
  }, [data]);

  const columns = [
    {
      title: "Bajarilgan buyurtmalar",
      dataIndex: "bajarilgan_buyurtma",
      width: 150,
      sortType: "string",
      render: (bajarilgan_buyurtma) => (
        <MainNumberFormat value={bajarilgan_buyurtma} />
      ),
    },
    {
      title: "Kunlish maosh",
      dataIndex: "kunlik_maosh",
      width: 150,
      sortType: "string",
      render: (kunlik_maosh) => <MainNumberFormat value={kunlik_maosh} />,
    },
    {
      title: "Kun",
      dataIndex: "kun",
      width: 150,
    },
    {
      title: "Buyurtmalar",
      dataIndex: "kun",
      width: 150,
      render: (_, { buyurtmalar }) => (
        <>
          <b>{buyurtmalar?.length}</b> ta
        </>
      ),
    },
  ];

  return (
    <>
      <p>
        Jami oylik summa: <b><MainNumberFormat value={totalPrice} /></b>
      </p>
      <MainDataTable
        mobile={true}
        showDatePicker={true}
        setDateValue={setSelectedDate}
        dateValue={selectedDate}
        columns={columns}
        isLoading={isLoading || isFetching}
        data={filterData}
        pagination={false}
        key={"product_id"}
        scroll={{ x: 300 }}
        expandableTableCurrent={{
          expandedRowRender: (record) => (
            <MainDataTable
              tableHeaderHidden={true}
              customHeader={false}
              data={record?.buyurtmalar}
              columns={[
                {
                  title: "Id",
                  dataIndex: "id",
                  key: "id",
                  width: 100,
                },
                {
                  title: "Mijoz",
                  dataIndex: "mijoz",
                  key: "mijoz",
                  width: 100,
                },
                {
                  title: "Dostavchik",
                  dataIndex: "dostavchik",
                  key: "dostavchik",
                  width: 100,
                },
                {
                  title: "Summa",
                  dataIndex: "summa",
                  key: "summa",
                  width: 100,
                  render: (_, { summa }) => (
                    <MainNumberFormat value={formatFloatNumber(summa)} />
                  ),
                },
                {
                  title: "Sana",
                  dataIndex: "sana",
                  key: "sana",
                  width: 100,
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  width: 100,
                },
              ]}
            />
          ),
        }}
      />
    </>
  );
}

export default SupplierMyIndicatorTable;

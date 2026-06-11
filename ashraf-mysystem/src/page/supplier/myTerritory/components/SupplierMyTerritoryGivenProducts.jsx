import { Tag } from "antd";
import React, { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ExportTable from "../../../../components/common/exportTable/ExportTable";
import MainNumberFormat from "../../../../components/common/numberFormat/MainNumberFormat";
import MainDataTable from "../../../../components/ui/dataTable/MainDataTable";
import MainRangeDatePicker from "../../../../components/ui/rangeDatePicker/MainRangeDatePicker";
import { useGetSupplierMyTerritoryGivenProductQuery } from "../../../../features/supplier/myTerritory/supplierMyTerritoryApiSlice";

function SupplierMyTerritoryGivenProducts() {
  // State
  const [selectedDate, setSelectedDate] = useState({ start: null, end: null });

  // Api
  const { data, isLoading, isError, refetch, isFetching } =
    useGetSupplierMyTerritoryGivenProductQuery(selectedDate);

  const filterData = useMemo(() => {
    if (
      data?.success === true &&
      data?.data &&
      data?.data?.orders &&
      Array.isArray(data?.data?.orders)
    ) {
      return data?.data?.orders.map((item) => ({
        key: uuidv4(),
        ...item,
      }));
    }
    return [];
  }, [data]);

  const columns = [
    {
      title: "Mijoz",
      dataIndex: "mijoz",
      width: 150,
      sortType: "string",
    },
    {
      title: "Yetkazib beruvchi",
      dataIndex: "dostavchik",
      width: 150,
      sortType: "string",
    },
    {
      title: "Summa",
      dataIndex: "summa",
      width: 150,
      sortType: "string",
      render: (summa) => <MainNumberFormat value={summa} />,
    },
    {
      title: "Sana",
      dataIndex: "sana",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      render: (status) => <Tag color="blue-inverse">{status}</Tag>,
    },
  ];

  return (
    <>
      <div style={{ maxWidth: 400, margin: "auto", padding: "1rem 10px" }}>
        <MainRangeDatePicker value={selectedDate} setValue={setSelectedDate} />
      </div>

      <MainDataTable
        columns={columns}
        isLoading={isLoading || isFetching}
        isError={isError}
        data={filterData}
        scroll={{ x: 500 }}
        customHeader={
          <ExportTable
            columns={columns}
            fileName="Dostavkachi-berilgan yuklar"
            data={[...filterData]}
          />
        }
        refetch={refetch}
        rowKey={"key"}
      />
    </>
  );
}

export default SupplierMyTerritoryGivenProducts;

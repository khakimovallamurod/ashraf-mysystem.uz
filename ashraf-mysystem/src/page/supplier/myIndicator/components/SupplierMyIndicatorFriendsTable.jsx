import React, { useMemo, useState } from "react";
import ExportTable from "../../../../components/common/exportTable/ExportTable";
import MainNumberFormat from "../../../../components/common/numberFormat/MainNumberFormat";
import MainDataTable from "../../../../components/ui/dataTable/MainDataTable";
import MainRangeDatePicker from "../../../../components/ui/rangeDatePicker/MainRangeDatePicker";
import { useGetSupplierMyIndicatorFriendsQuery } from "../../../../features/supplier/myIndicator/supplierMyIndicatorApiSlice";
import {Button} from "antd"

function SupplierMyIndicatorFriendsTable() {
  // State
  const [selectedDate, setSelectedDate] = useState({ start: null, end: null });

  // Api
  const { data, isLoading, isError, refetch, isFetching } =
    useGetSupplierMyIndicatorFriendsQuery(selectedDate);

  const filterData = useMemo(() => {
    if (
      data?.success === true &&
      data?.data &&
      data?.data?.dustlar_ulushi &&
      Array.isArray(data?.data?.dustlar_ulushi)
    ) {
      return data?.data?.dustlar_ulushi;
    }
    return [];
  }, [data]);

  const columns = [
    {
      title: "Yetkazib",
      dataIndex: "dostavkachi",
      width: 150,
      sortType: "string",
    },
    {
      title: "Buyurtmalar soni",
      dataIndex: "buyurtma_soni",
      width: 150,
      sortType: "string",
      render: (buyurtma_soni) => <MainNumberFormat value={buyurtma_soni} />,
    },
    {
      title: "Yordam ulishi",
      dataIndex: "yordam_ulushi",
      width: 150,
      sortType: "string",
      render: (yordam_ulushi) => <><MainNumberFormat value={yordam_ulushi} /> %</>,
    },
    {
      title: "Yordam ulishi",
      dataIndex: "operation",
      width: 150,
      align:'end',
      render: () => <Button shape="round" type="primary" size="small">Batafsil</Button>
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
      />
    </>
  );
}

export default SupplierMyIndicatorFriendsTable;

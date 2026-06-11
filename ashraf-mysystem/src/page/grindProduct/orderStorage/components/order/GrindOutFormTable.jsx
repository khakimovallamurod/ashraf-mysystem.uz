import React, { memo, useMemo } from "react";
import MainDataTable from "../../../../../components/ui/dataTable/MainDataTable";
import { useGetGrindProductsPolkaQuery } from "../../../../../features/grindProduct/GrindProductApiSlice";
import GrindOutProductForm from "../gindOutProductForm/GrindOutProductForm";

function GrindOutFormTable({ data, setGrindOutList, isLoading }) {
  /* API */
  const polkaData = useGetGrindProductsPolkaQuery();

  /* Memo */
  /* Polka Options */
  const polkaOptions = useMemo(() => {
    if (
      polkaData?.data?.success === true &&
      polkaData?.data?.data &&
      polkaData?.data?.data.length
    ) {
      return polkaData?.data?.data;
    }
    return [];
  }, [polkaData]);

  // Columns
  const columns = [
    {
      title: "Nomi",
      dataIndex: "name",
      width: 100,
      render: (_, record) => (
        <GrindOutProductForm
          polkaOptions={polkaOptions}
          product={record}
          setGrindOutList={setGrindOutList}
        />
      ),
    },
  ];

  return (
    <MainDataTable
      columns={columns}
      data={[...data]}
      scroll={{ x: 200 }}
      pagination={false}
      isLoading={isLoading}
    />
  );
}

export default memo(GrindOutFormTable);

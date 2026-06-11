import React, { useMemo } from "react";
import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";
import { useGetGrindOrderStorageInProcessQuery } from "../../../features/grindProduct/order/grindOrderStorageApiSlice";
import GrindOrderStorageList from "./components/order/GrindOrderStorageList";

function GrindOrderStorage() {
  const { data, isError, isLoading, refetch } =
    useGetGrindOrderStorageInProcessQuery();

  const orderStorageData = useMemo(() => {
    if (data?.success === true && data?.data && data?.data?.length) {
      return data.data;
    }
    return [];
  }, [data]);

  return isError ? (
    <MainRefetchBtn refetch={refetch} />
  ) : (
    <GrindOrderStorageList list={orderStorageData} isLoading={isLoading} />
  );
}

export default GrindOrderStorage;

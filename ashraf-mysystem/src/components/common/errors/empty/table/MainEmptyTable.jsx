import { Empty } from "antd";
import React from "react";
import MainRefetchBtn from "../../../refechBtn/MainRefetchBtn";

function MainEmptyTable({ refetchStatus, onRefetch }) {
  return refetchStatus ? (
    <MainRefetchBtn refetch={onRefetch} />
  ) : (
    <Empty description="Ma'lumot mavjud emas!" />
  );
}

export default MainEmptyTable;

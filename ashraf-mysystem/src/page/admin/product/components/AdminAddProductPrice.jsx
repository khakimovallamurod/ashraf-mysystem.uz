import React, { useMemo } from "react";
import { useGetAdminProductsQuery } from "../../../../features/admin/product/adminProductApiSlice";
import AdminAddProductPriceTable from "./AdminAddProductPriceTable";

function AdminAddProductPrice() {
  /* API */
  const { data, isLoading, isError, refetch } = useGetAdminProductsQuery();

  const productData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  return (
    <AdminAddProductPriceTable
      component={"outProduct"}
      data={productData}
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
    />
  );
}

export default AdminAddProductPrice;

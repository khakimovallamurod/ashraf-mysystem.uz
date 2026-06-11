import React, { useMemo } from "react";
import SupplierOrderSales from "../../../components/supplier/order/orderSales/SupplierOrderSales";
import { useGetSupplierOrderSalesInProcessQuery } from "../../../features/supplier/order/orderOfSales/supplierOrderOfSalesApiSlice";

function SupplierHome() {
  const salesOrderInProcess = useGetSupplierOrderSalesInProcessQuery();

  /* Sales in proccess */
  const salesOrderInProcessList = useMemo(() => {
    if (
      salesOrderInProcess?.data?.success === true &&
      salesOrderInProcess?.data?.data &&
      salesOrderInProcess?.data?.data?.length
    ) {
      return salesOrderInProcess?.data?.data?.map((item) => ({
        id: item.id,
        clientName: item?.client?.fio,
        clientTelefon: item?.client?.telefon,
        clientLocation: item?.client?.manzil,
        date: item?.vaqt,
        productsCount: item?.product_list?.length || 0,
        productsList: item?.product_list?.map((item, index) => ({
          key: index,
          mass: item.massa,
          price: item?.price,
          summ: item?.summa,
          status: item?.status,
          completedCount: item?.tayyorlandi,
        })),
      }));
    }
    return [];
  }, [salesOrderInProcess]);

  return (
    <div style={{ paddingLeft: "15px" }}>
      <SupplierOrderSales
        list={[...salesOrderInProcessList]}
        isLoading={salesOrderInProcess?.isLoading}
      />
    </div>
  );
}

export default SupplierHome;

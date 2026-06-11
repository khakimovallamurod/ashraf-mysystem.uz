import { SUPPLIER_API } from "../../../../app/api/api";
import { apiSlice } from "../../../../app/api/apiSlice";

export const SUPPLIER_ORDER_OF_SALES_TAG = "SUPPLIER_ORDER_OF_SALES";

export const supplierOrderOfSalesApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [SUPPLIER_ORDER_OF_SALES_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSupplierOrderSalesInProcess: builder.query({
        query: () => SUPPLIER_API.SALES_ORDER_IN_PROCESS_GET,
        providesTags: [SUPPLIER_ORDER_OF_SALES_TAG],
      }),
      addSupplierOrderSalesConfirm: builder.mutation({
        query: (id) => ({
          url: SUPPLIER_API.SALES_ORDER_CONFIRM_ADD(id),
          method: "PUT",
        }),
        invalidatesTags: [SUPPLIER_ORDER_OF_SALES_TAG],
      }),
      addSupplierGiveSalesOrder: builder.mutation({
        query: ({id, body}) => ({
          url: SUPPLIER_API.SALES_GIVE_ORDER(id),
          method: "POST",
          body
        }),
        invalidatesTags: [SUPPLIER_ORDER_OF_SALES_TAG],
      }),
    }),
  });

export const {
  useGetSupplierOrderSalesInProcessQuery,
  useAddSupplierOrderSalesConfirmMutation,
  useAddSupplierGiveSalesOrderMutation,
} = supplierOrderOfSalesApiSlice;

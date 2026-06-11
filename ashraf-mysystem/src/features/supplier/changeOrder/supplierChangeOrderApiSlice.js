import { SUPPLIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";
import { SUPPLIER_ORDER_OF_SALES_TAG } from "../order/orderOfSales/supplierOrderOfSalesApiSlice";

const SUPPLIER_CHANGE_ORDER_TAG = "SUPPLIER_CHANGE_ORDER";

export const supplierChangeOrderApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [SUPPLIER_CHANGE_ORDER_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSupplierAll: builder.query({
        query: () => SUPPLIER_API.SUPPLIER_LIST,
      }),
      getSupplierChangedOrderList: builder.query({
        query: () => SUPPLIER_API.CHANGED_ORDER_LIST_GET,
        providesTags: [SUPPLIER_CHANGE_ORDER_TAG],
      }),
      getSupplierSendedOrderList: builder.query({
        query: () => SUPPLIER_API.CHANGE_ORDER_SENDED_LIST_GET,
        providesTags: [SUPPLIER_CHANGE_ORDER_TAG],
      }),
      addSupplierChangeOrder: builder.mutation({
        query: (body) => ({
          url: SUPPLIER_API.CHANGE_ORDER_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [SUPPLIER_CHANGE_ORDER_TAG],
      }),
      addSupplierConfirmOrder: builder.mutation({
        query: ({ orderId, body }) => ({
          url: SUPPLIER_API.CHANGE_CONFIRM_ORDER_PUT(orderId),
          method: "PUT",
          body,
        }),
        invalidatesTags: [
          SUPPLIER_CHANGE_ORDER_TAG,
          SUPPLIER_ORDER_OF_SALES_TAG,
        ],
      }),
    }),
  });

export const {
  useGetSupplierAllQuery,
  useGetSupplierChangedOrderListQuery,
  useGetSupplierSendedOrderListQuery,
  useAddSupplierChangeOrderMutation,
  useAddSupplierConfirmOrderMutation,
} = supplierChangeOrderApiSlice;

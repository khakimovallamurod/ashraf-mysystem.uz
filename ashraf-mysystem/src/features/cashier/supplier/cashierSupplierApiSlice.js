import { CASHIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const CASHIER_SUPPLIER_TAG = "CASHIER_SUPPLIER";

export const cashierSupplierApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [CASHIER_SUPPLIER_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getCashierSupplier: builder.query({
        query: () => CASHIER_API.SUPPLIER_GET,
        providesTags: [CASHIER_SUPPLIER_TAG],
      }),
      getCashierSupplierHistoryByDate: builder.mutation({
        query: ({ start, end, supplierId }) => ({
          url: CASHIER_API.SUPPLIER_HISTORY_GET({ start, end, supplierId }),
          method: "GET",
        }),
        providesTags: [CASHIER_SUPPLIER_TAG],
      }),
      addCashierSupplierReception: builder.mutation({
        query: (body) => ({
          url: CASHIER_API.SUPPLIER_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [CASHIER_SUPPLIER_TAG],
      }),
    }),
  });

export const {
  useGetCashierSupplierQuery,
  useGetCashierSupplierHistoryByDateMutation,
  useAddCashierSupplierReceptionMutation,
} = cashierSupplierApiSlice;

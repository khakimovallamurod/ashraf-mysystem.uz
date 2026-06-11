import { SUPPLIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const SUPPLIER_DEBT_TAG = "SUPPLIER_BALANCE";

export const supplierDebtApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [SUPPLIER_DEBT_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSuppplierCustomer: builder.query({
        query: () => SUPPLIER_API.CUSTOMER_GET,
      }),
      getSupplierDebt: builder.query({
        query: () => SUPPLIER_API.DEBT_GET,
        providesTags: [SUPPLIER_DEBT_TAG],
      }),
      getSupplierDebtByDate: builder.mutation({
        query: ({ start, end }) => ({
          url: SUPPLIER_API.DEBT_GET_BY_DATE({ start, end }),
          method: "GET",
        }),
        providesTags: [SUPPLIER_DEBT_TAG],
      }),
      addSupplierDebt: builder.mutation({
        query: (body) => ({
          url: SUPPLIER_API.DEBT_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [SUPPLIER_DEBT_TAG],
      }),
    }),
  });

export const {
  useGetSuppplierCustomerQuery,
  useGetSupplierDebtQuery,
  useGetSupplierDebtByDateMutation,
  useAddSupplierDebtMutation,
} = supplierDebtApiSlice;

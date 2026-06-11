import { SUPPLIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const SUPPLIER_BALANCE_TAG = "SUPPLIER_BALANCE";

export const supplierBalanceApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [SUPPLIER_BALANCE_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      /* Reception */
      getSupplierBalance: builder.query({
        query: () => SUPPLIER_API.BALANCE_GET,
        providesTags: [SUPPLIER_BALANCE_TAG],
      }),
    }),
  });

export const { useGetSupplierBalanceQuery } = supplierBalanceApiSlice;

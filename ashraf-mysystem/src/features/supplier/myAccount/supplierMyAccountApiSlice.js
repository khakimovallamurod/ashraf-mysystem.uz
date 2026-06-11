import { SUPPLIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

export const SUPPLIER_MY_ACCOUNT_TAG = "SUPPLIER_MY_ACCOUNT";

export const supplierMyAccountApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [SUPPLIER_MY_ACCOUNT_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSupplierMyAccountByDate: builder.query({
        query: ({ start, end }) =>
          SUPPLIER_API.MY_ACCOUNT_GET_BY_DATE({ start, end }),
        providesTags: [SUPPLIER_MY_ACCOUNT_TAG],
      }),
    }),
  });

export const { useGetSupplierMyAccountByDateQuery } = supplierMyAccountApiSlice;

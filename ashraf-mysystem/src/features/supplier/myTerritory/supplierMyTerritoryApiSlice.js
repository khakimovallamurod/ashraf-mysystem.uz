import { SUPPLIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

export const SUPPLIER_MY_ACCOUNT_TAG = "SUPPLIER_MY_ACCOUNT";

export const supplierMyTerritoryApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [SUPPLIER_MY_ACCOUNT_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSupplierMyTerritoryGivenProduct: builder.query({
        query: ({ start, end }) =>
          SUPPLIER_API.MY_TERRITORY_GIVEN_PRODUCT_GET_BY_DATE({ start, end }),
        providesTags: [SUPPLIER_MY_ACCOUNT_TAG],
      }),
      getSupplierMyTerritoryReceivedProduct: builder.query({
        query: ({ start, end }) =>
          SUPPLIER_API.MY_TERRITORY_RECEIVED_PRODUCT_GET_BY_DATE({
            start,
            end,
          }),
        providesTags: [SUPPLIER_MY_ACCOUNT_TAG],
      }),
    }),
  });

export const {
  useGetSupplierMyTerritoryGivenProductQuery,
  useGetSupplierMyTerritoryReceivedProductQuery,
} = supplierMyTerritoryApiSlice;

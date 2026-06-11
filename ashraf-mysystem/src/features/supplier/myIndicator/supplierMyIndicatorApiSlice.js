import { SUPPLIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

export const SUPPLIER_MY_INDICATOR_TAG = "SUPPLIER_MY_INDICATOR";

export const supplierMyIndicatorApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [SUPPLIER_MY_INDICATOR_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSupplierMyIndicator: builder.query({
        query: ({ start, end }) =>
          SUPPLIER_API.MY_INDICATOR_GET({ start, end }),
        providesTags: [SUPPLIER_MY_INDICATOR_TAG],
      }),
      getSupplierMyIndicatorFriends: builder.query({
        query: ({ start, end }) =>
          SUPPLIER_API.MY_INDICATOR_FRIENDS_GET({
            start,
            end,
          }),
        providesTags: [SUPPLIER_MY_INDICATOR_TAG],
      }),
    }),
  });

export const {
  useGetSupplierMyIndicatorQuery,
  useGetSupplierMyIndicatorFriendsQuery,
} = supplierMyIndicatorApiSlice;

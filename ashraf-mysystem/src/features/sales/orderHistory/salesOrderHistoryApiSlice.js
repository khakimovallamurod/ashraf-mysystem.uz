import { SALES_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

export const SALES_ORDER_HISTORY_TAG = "SALES_ORDER_HISTORY";

export const salesOrderHistoryApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: SALES_ORDER_HISTORY_TAG })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSalesOrderHistory: builder.query({
        query: () => SALES_API.ORDER_HISTORY_GET,
        providesTags: [SALES_ORDER_HISTORY_TAG],
      }),
      getSalesOrderHistoryByDate: builder.mutation({
        query: ({ start, end, customerId }) => ({
          url: SALES_API.ORDER_HISTORY_GET_BY_DATE({ start, end, customerId }),
          method: "GET",
        }),
      }),
      addSalesOrderHistoryCloseOrder: builder.mutation({
        query: (body) => ({
          url: SALES_API.ORDER_DELETE_POST,
          method: "POST",
          body,
        }),
        invalidatesTags: [SALES_ORDER_HISTORY_TAG],
      }),
    }),
  });

export const {
  useGetSalesOrderHistoryQuery,
  useGetSalesOrderHistoryByDateMutation,
  useAddSalesOrderHistoryCloseOrderMutation,
} = salesOrderHistoryApiSlice;

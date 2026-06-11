import { SALES_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const SALES_RETURN_PRODUCT_TAG = "SALES_RETURN_PRODUCT_TAG";

export const salesReturnProductApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [SALES_RETURN_PRODUCT_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      /* Index */
      getSalesReturnProductsHistory: builder.query({
        query: () => SALES_API.RETURN_PRODUCT_HISTORY_GET,
      }),

      getSalesReturnProductsHistoryByDate: builder.mutation({
        query: ({ start, end }) => ({
          url: SALES_API.RETURN_PRODUCT_HISTORY_GET_BY_DATE({ start, end }),
          method: "GET",
        }),
      }),
      /* Update */
      putSalesReturnProducts: builder.mutation({
        query: ({ id }) => ({
          url: SALES_API.RETURN_PRODUCT_CONFIRM_PUT(id),
          method: "PUT",
        }),
      }),
    }),
  });

export const {
  useGetSalesReturnProductsHistoryQuery,
  useGetSalesReturnProductsHistoryByDateMutation,
  usePutSalesReturnProductsMutation,
} = salesReturnProductApiSlice;

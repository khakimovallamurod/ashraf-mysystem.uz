import { CASHIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const CASHIER_SALE_ORDER_TAG = "CASHIER_SALE_ORDER";

export const cashierSaleOrderApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [CASHIER_SALE_ORDER_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getCashierSaleOrder: builder.query({
        query: () => CASHIER_API.SALE_ORDER_GET,
        providesTags: [CASHIER_SALE_ORDER_TAG],
      }),
      getCashierSaleOrderByDate: builder.mutation({
        query: (date) => ({
          url: CASHIER_API.SALE_ORDER_GET_BY_DATE(date?.start, date?.end),
          method: "GET",
        }),
        providesTags: [CASHIER_SALE_ORDER_TAG],
      }),
    }),
  });

export const {
  useGetCashierSaleOrderQuery,
  useGetCashierSaleOrderByDateMutation,
} = cashierSaleOrderApiSlice;

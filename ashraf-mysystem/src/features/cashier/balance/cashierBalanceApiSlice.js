import { CASHIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const CASHIER_BALANCE_TAG = "CASHIER_BALANCE";

export const cashierBalanceApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [CASHIER_BALANCE_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getCashierBalanceByDate: builder.mutation({
        query: ({ start, end }) => ({
          url: CASHIER_API.BALANCE_GET_BY_DATE({ start, end }),
          method: "GET",
        }),
        providesTags: [CASHIER_BALANCE_TAG],
      }),
      getCashierExchangeHistory: builder.query({
        query: () => CASHIER_API.BALANCE_CHANGE_HISTORY_GET,
        providesTags: [CASHIER_BALANCE_TAG],
      }),

      addCashierBalanceChange: builder.mutation({
        query: (body) => ({
          url: CASHIER_API.BALANCE_CHANGE_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [CASHIER_BALANCE_TAG],
      }),
    }),
  });

export const {
  useGetCashierBalanceByDateMutation,
  useGetCashierExchangeHistoryQuery,
  useAddCashierBalanceChangeMutation,
} = cashierBalanceApiSlice;

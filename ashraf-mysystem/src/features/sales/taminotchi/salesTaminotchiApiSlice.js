import { SALES_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const SALES_TAMINOTCHI_TAG = "SALES_TAMINOTCHI";

export const salesTaminotchiApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [SALES_TAMINOTCHI_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSalesTaminotchi: builder.query({
        query: () => SALES_API.TAMINOTCHI_GET,
      }),
      getSalesTaminotchiPayHistory: builder.query({
        query: (params) => SALES_API.TAMINOTCHI_PAY_HISTORY_GET(params),
        providesTags: [SALES_TAMINOTCHI_TAG],
      }),
      addSalesTaminotchiPay: builder.mutation({
        query: (body) => ({
          url: SALES_API.TAMINOTCHI_PAY_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [SALES_TAMINOTCHI_TAG],
      }),
      addSalesTaminotchiCashIn: builder.mutation({
        query: (body) => ({
          url: SALES_API.TAMINOTCHI_CASH_IN_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [SALES_TAMINOTCHI_TAG],
      }),
      addSalesTaminotchiSmsConfirm: builder.mutation({
        query: (body) => ({
          url: SALES_API.TAMINOTCHI_SMS_CONFIRM_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [SALES_TAMINOTCHI_TAG],
      }),
    }),
  });

export const {
  useGetSalesTaminotchiQuery,
  useGetSalesTaminotchiPayHistoryQuery,
  useAddSalesTaminotchiPayMutation,
  useAddSalesTaminotchiCashInMutation,
  useAddSalesTaminotchiSmsConfirmMutation,
} = salesTaminotchiApiSlice;

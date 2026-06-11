import { CASHIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const CASHIER_PRODUCT_PROVIDER_TAG = "CASHIER_PRODUCT_PROVIDER";

export const cashierProviderApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [CASHIER_PRODUCT_PROVIDER_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getCashierProdProvider: builder.query({
        query: () => CASHIER_API.PROVIDER_GET_OF_CASHIER,
      }),
      getCashierPayProviderHistory: builder.query({
        query: () => CASHIER_API.PROVIDER_PAY_HISTORY_GET,
        providesTags: [CASHIER_PRODUCT_PROVIDER_TAG],
      }),
      addCashierPayProvider: builder.mutation({
        query: (body) => ({
          url: CASHIER_API.PROVIDER_PAY_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [CASHIER_PRODUCT_PROVIDER_TAG],
      }),
      addCashierSmsCodeConfirm: builder.mutation({
        query: (body) => ({
          url: CASHIER_API.SMS_CONFIRM_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [CASHIER_PRODUCT_PROVIDER_TAG],
      }),
    
    }),
  });

export const {
  useGetCashierProdProviderQuery,
  useGetCashierPayProviderHistoryQuery,
  useAddCashierPayProviderMutation,
  useAddCashierSmsCodeConfirmMutation
} = cashierProviderApiSlice;

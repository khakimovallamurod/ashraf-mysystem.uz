import { CASHIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const CASHIER_CUSTOMER_REPORT_TAG = "CASHIER_CUSTOMER_REPORT";

export const cashierReportApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [CASHIER_CUSTOMER_REPORT_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getCashierCustomerReportByDate: builder.mutation({
        query: ({ start, end, supplierId }) => ({
          url: CASHIER_API.CUSTOMER_REPORT_GET({ start, end, supplierId }),
          method: "GET",
        }),
        providesTags: [CASHIER_CUSTOMER_REPORT_TAG],
      }),
    }),
  });

export const { useGetCashierCustomerReportByDateMutation } =
  cashierReportApiSlice;

import { SALES_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const SALES_CUSTOMER_TAG = "SALES_CUSTOMER";

const salesCustomerApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [SALES_CUSTOMER_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      /* Index */
      getSalesCustomer: builder.query({
        query: () => SALES_API.CUSTOMER_GET,
        providesTags: [SALES_CUSTOMER_TAG],
      }),
      /* indeex  category */
      getSalesCustomerCategory: builder.query({
        query: () => SALES_API.CUSTOMER_CATEGORY_GET,
      }),
      /* indeex  supplier */
      getSalesSupplier: builder.query({
        query: () => SALES_API.SUPPLIER_GET,
      }),
      /* Add */
      addSalesCustomer: builder.mutation({
        query: (data) => ({
          url: SALES_API.CUSTOMER_ADD,
          method: "POST",
          body: data,
        }),
        invalidatesTags: [SALES_CUSTOMER_TAG],
      }),
      /* Edit */
      editSalesCustomer: builder.mutation({
        query: ({id, data}) => ({
          url: SALES_API.CUSTOMER_PUT(id),
          method: "PUT",
          body: data,
        }),
        invalidatesTags: [SALES_CUSTOMER_TAG],
      }),
      /* Add Cash In */
      addSalesCustomerCashIn: builder.mutation({
        query: (body) => ({
          url: SALES_API.CUSTOMER_CASH_IN_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [SALES_CUSTOMER_TAG],
      }),
      /* Pay History */
      getSalesCustomerPayHistory: builder.query({
        query: (params) => SALES_API.CUSTOMER_PAY_HISTORY_GET(params),
        providesTags: [SALES_CUSTOMER_TAG],
      }),
      sendSalesCustomerCashInMessage: builder.mutation({
        query: (body) => ({
          url: SALES_API.CUSTOMER_CASH_IN_SEND_MESSAGE,
          method: "POST",
          body,
        }),
      }),
    }),
  });

export const {
  useGetSalesCustomerQuery,
  useAddSalesCustomerMutation,
  useGetSalesCustomerCategoryQuery,
  useGetSalesSupplierQuery,
  useEditSalesCustomerMutation,
  useAddSalesCustomerCashInMutation,
  useGetSalesCustomerPayHistoryQuery,
  useSendSalesCustomerCashInMessageMutation,
} = salesCustomerApiSlice;

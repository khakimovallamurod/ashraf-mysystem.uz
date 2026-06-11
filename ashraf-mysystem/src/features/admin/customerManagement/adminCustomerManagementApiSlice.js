import { ADMIN_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const ADMIN_CUSTOMER_MGMT_TAG = "ADMIN_CUSTOMER_MGMT";

export const adminCustomerManagementApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [ADMIN_CUSTOMER_MGMT_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminCustomerMgmt: builder.query({
        query: () => ADMIN_API.CUSTOMER_MGMT_GET,
        providesTags: [ADMIN_CUSTOMER_MGMT_TAG],
      }),
      addAdminCustomerMgmt: builder.mutation({
        query: (body) => ({
          url: ADMIN_API.CUSTOMER_MGMT_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [ADMIN_CUSTOMER_MGMT_TAG],
      }),
      editAdminCustomerMgmt: builder.mutation({
        query: ({ id, ...body }) => ({
          url: ADMIN_API.CUSTOMER_MGMT_EDIT(id),
          method: "PUT",
          body,
        }),
        invalidatesTags: [ADMIN_CUSTOMER_MGMT_TAG],
      }),
      deleteAdminCustomerMgmt: builder.mutation({
        query: (id) => ({
          url: ADMIN_API.CUSTOMER_MGMT_DELETE(id),
          method: "DELETE",
        }),
        invalidatesTags: [ADMIN_CUSTOMER_MGMT_TAG],
      }),
      getAdminCustomerMgmtTransactions: builder.query({
        query: (params) => ADMIN_API.CUSTOMER_MGMT_TRANSACTIONS_GET(params),
        providesTags: [ADMIN_CUSTOMER_MGMT_TAG],
      }),
      getAdminCustomerMgmtReport: builder.query({
        query: (params) => ADMIN_API.CUSTOMER_MGMT_REPORT_GET(params),
        providesTags: [ADMIN_CUSTOMER_MGMT_TAG],
      }),
    }),
  });

export const {
  useGetAdminCustomerMgmtQuery,
  useAddAdminCustomerMgmtMutation,
  useEditAdminCustomerMgmtMutation,
  useDeleteAdminCustomerMgmtMutation,
  useGetAdminCustomerMgmtTransactionsQuery,
  useGetAdminCustomerMgmtReportQuery,
} = adminCustomerManagementApiSlice;

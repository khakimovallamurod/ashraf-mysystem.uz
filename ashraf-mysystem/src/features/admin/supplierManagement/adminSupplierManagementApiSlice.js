import { ADMIN_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const ADMIN_SUPPLIER_MGMT_TAG = "ADMIN_SUPPLIER_MGMT";

export const adminSupplierManagementApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [ADMIN_SUPPLIER_MGMT_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminSupplierMgmt: builder.query({
        query: () => ADMIN_API.SUPPLIER_MGMT_GET,
        providesTags: [ADMIN_SUPPLIER_MGMT_TAG],
      }),
      addAdminSupplierMgmt: builder.mutation({
        query: (body) => ({
          url: ADMIN_API.SUPPLIER_MGMT_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [ADMIN_SUPPLIER_MGMT_TAG],
      }),
      editAdminSupplierMgmt: builder.mutation({
        query: ({ id, ...body }) => ({
          url: ADMIN_API.SUPPLIER_MGMT_EDIT(id),
          method: "PUT",
          body,
        }),
        invalidatesTags: [ADMIN_SUPPLIER_MGMT_TAG],
      }),
      deleteAdminSupplierMgmt: builder.mutation({
        query: (id) => ({
          url: ADMIN_API.SUPPLIER_MGMT_DELETE(id),
          method: "DELETE",
        }),
        invalidatesTags: [ADMIN_SUPPLIER_MGMT_TAG],
      }),
      getAdminSupplierMgmtPayments: builder.query({
        query: (params) => ADMIN_API.SUPPLIER_MGMT_PAYMENTS_GET(params),
        providesTags: [ADMIN_SUPPLIER_MGMT_TAG],
      }),
      getAdminSupplierMgmtReport: builder.query({
        query: (params) => ADMIN_API.SUPPLIER_MGMT_REPORT_GET(params),
        providesTags: [ADMIN_SUPPLIER_MGMT_TAG],
      }),
      getAdminSupplierMgmtAllReport: builder.query({
        query: (params) => ADMIN_API.SUPPLIER_MGMT_ALL_REPORT_GET(params),
        providesTags: [ADMIN_SUPPLIER_MGMT_TAG],
      }),
    }),
  });

export const {
  useGetAdminSupplierMgmtQuery,
  useAddAdminSupplierMgmtMutation,
  useEditAdminSupplierMgmtMutation,
  useDeleteAdminSupplierMgmtMutation,
  useGetAdminSupplierMgmtPaymentsQuery,
  useGetAdminSupplierMgmtReportQuery,
  useGetAdminSupplierMgmtAllReportQuery,
} = adminSupplierManagementApiSlice;

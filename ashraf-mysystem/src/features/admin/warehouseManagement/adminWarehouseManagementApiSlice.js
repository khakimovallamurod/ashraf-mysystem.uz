import { ADMIN_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const ADMIN_WAREHOUSE_TAG = "ADMIN_WAREHOUSE";

export const adminWarehouseManagementApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [ADMIN_WAREHOUSE_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminWarehouseTransfer: builder.query({
        query: (params) => ADMIN_API.WAREHOUSE_TRANSFER_GET(params),
        providesTags: [ADMIN_WAREHOUSE_TAG],
      }),
      addAdminWarehouseTransfer: builder.mutation({
        query: (body) => ({
          url: ADMIN_API.WAREHOUSE_TRANSFER_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [ADMIN_WAREHOUSE_TAG],
      }),
      getAdminWarehouseMassReport: builder.query({
        query: (params) => ADMIN_API.WAREHOUSE_MASS_REPORT_GET(params),
        providesTags: [ADMIN_WAREHOUSE_TAG],
      }),
    }),
  });

export const {
  useGetAdminWarehouseTransferQuery,
  useAddAdminWarehouseTransferMutation,
  useGetAdminWarehouseMassReportQuery,
} = adminWarehouseManagementApiSlice;

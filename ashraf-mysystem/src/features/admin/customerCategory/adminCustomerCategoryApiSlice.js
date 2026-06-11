import { ADMIN_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const ADMIN_WORKER_TAG = "ADMIN_WORKER";

export const adminWorkerApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [ADMIN_WORKER_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminCustomerCategory: builder.query({
        query: () => ADMIN_API.CUSTOMER_CATEGORY_GET,
        providesTags: [ADMIN_WORKER_TAG],
      }),
      addCustomerCategoryWorker: builder.mutation({
        query: (body) => ({
          url: ADMIN_API.CUSTOMER_CATEGORY_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [ADMIN_WORKER_TAG],
      }),
    }),
  });

export const {
  useGetAdminCustomerCategoryQuery,
  useAddCustomerCategoryWorkerMutation,
} = adminWorkerApiSlice;

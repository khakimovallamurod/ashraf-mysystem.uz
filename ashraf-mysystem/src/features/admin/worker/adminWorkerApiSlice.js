import { ADMIN_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const ADMIN_WORKER_TAG = "ADMIN_WORKER";

export const adminWorkerApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [ADMIN_WORKER_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminWorker: builder.query({
        query: () => ADMIN_API.WORKER_GET,
        providesTags: [ADMIN_WORKER_TAG],
      }),
      addAdminWorker: builder.mutation({
        query: (body) => ({
          url: ADMIN_API.WORKER_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [ADMIN_WORKER_TAG],
      }),
    }),
  });

export const { useGetAdminWorkerQuery, useAddAdminWorkerMutation } =
  adminWorkerApiSlice;

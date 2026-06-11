import { ADMIN_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const ADMIN_USER_TAG = "ADMIN_USER";

export const adminUserApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [ADMIN_USER_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminUser: builder.query({
        query: () => ADMIN_API.USER_GET,
        providesTags: [ADMIN_USER_TAG],
      }),
      addAdminUser: builder.mutation({
        query: (body) => ({
          url: ADMIN_API.USER_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [ADMIN_USER_TAG],
      }),
      putAdminUser: builder.mutation({
        query: (body) => ({
          url: ADMIN_API.USER_PUT,
          method: "PUT",
          body,
        }),
        invalidatesTags: [ADMIN_USER_TAG],
      }),
      deleteAdminUser: builder.mutation({
        query: (userId) => ({
          url: ADMIN_API.USER_DELETE(userId),
          method: "DELETE",
        }),
        invalidatesTags: [ADMIN_USER_TAG],
      }),
    }),
  });

export const {
  useGetAdminUserQuery,
  useAddAdminUserMutation,
  usePutAdminUserMutation,
  useDeleteAdminUserMutation
} = adminUserApiSlice;

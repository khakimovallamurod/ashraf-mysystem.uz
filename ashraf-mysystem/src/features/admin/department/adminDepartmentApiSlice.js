import { ADMIN_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const ADMIN_DEPARTMENT_TAG = "ADMIN_DEPARTMENT";

export const adminDepartmentApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [ADMIN_DEPARTMENT_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminDepartment: builder.query({
        query: () => ADMIN_API.DEPARTMENT_GET,
        providesTags: [ADMIN_DEPARTMENT_TAG],
      }),
      addAdminDepartment: builder.mutation({
        query: (body) => ({
          url: ADMIN_API.DEPARTMENT_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [ADMIN_DEPARTMENT_TAG],
      }),
    }),
  });

export const { useGetAdminDepartmentQuery, useAddAdminDepartmentMutation } =
  adminDepartmentApiSlice;

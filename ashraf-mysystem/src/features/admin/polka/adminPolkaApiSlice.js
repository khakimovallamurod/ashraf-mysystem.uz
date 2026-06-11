import { ADMIN_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const ADMIN_POLKA_TAG = "ADMIN_POLKA";

export const adminPolkaApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [ADMIN_POLKA_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminPolka: builder.query({
        query: () => ADMIN_API.POLKA_GET,
        providesTags: [ADMIN_POLKA_TAG],
      }),
      getAdminPolkaByDepart: builder.mutation({
        query: (id) => ({
          url: ADMIN_API.POLKA_GET_BY_DEPARTMENT(id),
          method: "GET",
        }),
      }),
      addAdminPolka: builder.mutation({
        query: (body) => ({
          url: ADMIN_API.POLKA_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [ADMIN_POLKA_TAG],
      }),
    }),
  });

export const {
  useGetAdminPolkaQuery,
  useGetAdminPolkaByDepartMutation,
  useAddAdminPolkaMutation,
} = adminPolkaApiSlice;

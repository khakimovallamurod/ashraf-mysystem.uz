import { ADMIN_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const ADMIN_EXPENSES_TAG = "ADMIN_EXPENSES";

export const adminExpenseApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [ADMIN_EXPENSES_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminExpenses: builder.query({
        query: () => ADMIN_API.EXPENSES_GET,
        providesTags: [ADMIN_EXPENSES_TAG],
      }),
      addAdminExpenses: builder.mutation({
        query: (body) => ({
          url: ADMIN_API.EXPENSES_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [ADMIN_EXPENSES_TAG],
      }),
      deleteAdminExpenses: builder.mutation({
        query: (id) => ({
          url: ADMIN_API.EXPENSES_DELETE(id),
          method: "DELETE",
        }),
        invalidatesTags: [ADMIN_EXPENSES_TAG],
      }),
    }),
  });

export const {
  useGetAdminExpensesQuery,
  useAddAdminExpensesMutation,
  useDeleteAdminExpensesMutation
} = adminExpenseApiSlice;

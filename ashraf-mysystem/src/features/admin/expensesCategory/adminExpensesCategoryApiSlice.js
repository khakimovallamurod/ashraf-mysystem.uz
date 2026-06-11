import { ADMIN_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const ADMIN_EXPENSES_CATEGORY_TAG = "ADMIN_EXPENSES_CATEGORY";

export const adminExpensesCategoryApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [ADMIN_EXPENSES_CATEGORY_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminExpensesCategory: builder.query({
        query: () => ADMIN_API.EXPENSES_CATEGORY_GET,
        providesTags: [ADMIN_EXPENSES_CATEGORY_TAG],
      }),
      addAdminExpensesCategory: builder.mutation({
        query: (body) => ({
          url: ADMIN_API.EXPENSES_CATEGORY_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [ADMIN_EXPENSES_CATEGORY_TAG],
      }),
    }),
  });

export const {
  useGetAdminExpensesCategoryQuery,
  useAddAdminExpensesCategoryMutation,
} = adminExpensesCategoryApiSlice;

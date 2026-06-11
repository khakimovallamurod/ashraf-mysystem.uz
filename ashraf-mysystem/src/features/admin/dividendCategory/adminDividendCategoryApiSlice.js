import { ADMIN_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const ADMIN_DIVIDEND_CATEGORY_TAG = "ADMIN_DIVIDEND_CATEGORY";

export const adminDividendCategoryApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [ADMIN_DIVIDEND_CATEGORY_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminDividendCategory: builder.query({
        query: () => ADMIN_API.DIVIDEND_CATEGORY_GET,
        providesTags: [ADMIN_DIVIDEND_CATEGORY_TAG],
      }),
      addAdminDividendCategory: builder.mutation({
        query: (body) => ({
          url: ADMIN_API.DIVIDEND_CATEGORY_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [ADMIN_DIVIDEND_CATEGORY_TAG],
      }),
    }),
  });

export const {
  useGetAdminDividendCategoryQuery,
  useAddAdminDividendCategoryMutation,
} = adminDividendCategoryApiSlice;

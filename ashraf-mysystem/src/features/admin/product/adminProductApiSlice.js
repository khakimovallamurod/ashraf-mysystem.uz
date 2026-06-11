import { ADMIN_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const ADMIN_PRODUCT_TAG = "ADMIN_DEPARTMENT";

export const adminProductApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [ADMIN_PRODUCT_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminProducts: builder.query({
        query: () => ADMIN_API.PRODUCT_GET,
        providesTags: [ADMIN_PRODUCT_TAG],
      }),
      addAdminProduct: builder.mutation({
        query: (body) => ({
          url: ADMIN_API.PRODUCT_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [ADMIN_PRODUCT_TAG],
      }),
      addAdminProductPrice: builder.mutation({
        query: (body) => ({
          url: ADMIN_API.PRODUCT_PRICE_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [ADMIN_PRODUCT_TAG],
      }),
    }),
  });

export const {
  useGetAdminProductsQuery,
  useAddAdminProductMutation,
  useAddAdminProductPriceMutation,
} = adminProductApiSlice;

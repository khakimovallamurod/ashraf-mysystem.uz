import { GRIND_PRODUCT_API } from "../../app/api/api";
import { apiSlice } from "../../app/api/apiSlice";

const GRIND_PRODUCT_TAG = "GRIND_PRODUCT";

export const grindProductApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [GRIND_PRODUCT_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      /* Products */
      getGrindProductsList: builder.query({
        query: () => GRIND_PRODUCT_API.GET_PRODUCTS,
        providesTags: [GRIND_PRODUCT_TAG],
      }),
      /* Polka */
      getGrindProductsPolka: builder.query({
        query: () => GRIND_PRODUCT_API.POLKA_GET,
      }),

      /* SPARE */
      getGrindProductsSpare: builder.query({
        query: () => GRIND_PRODUCT_API.SPARE_GET,
      }),
      getGrindProductsSpareProduct: builder.query({
        query: () => GRIND_PRODUCT_API.SPARE_PRODUCT_GET,
      }),
    }),
  });

export const {
  useGetGrindProductsListQuery,
  useGetGrindProductsPolkaQuery,
  
  useGetGrindProductsSpareQuery,
  useGetGrindProductsSpareProductQuery,
} = grindProductApiSlice;

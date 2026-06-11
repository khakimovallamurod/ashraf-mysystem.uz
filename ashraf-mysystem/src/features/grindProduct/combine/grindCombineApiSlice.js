import { GRIND_PRODUCT_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const GRIND_PRODUCT_COMBINE_TAG = "GRIND_PRODUCT_COMBINE";

export const grindCombineApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [GRIND_PRODUCT_COMBINE_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      /* COMBINE */
      addGrindProductCombine: builder.mutation({
        query: (body) => ({
          url: GRIND_PRODUCT_API.PARTIYA_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [GRIND_PRODUCT_COMBINE_TAG],
      }),
    }),
  });

export const {
  /* COMBINE */
  useAddGrindProductCombineMutation,
} = grindCombineApiSlice;

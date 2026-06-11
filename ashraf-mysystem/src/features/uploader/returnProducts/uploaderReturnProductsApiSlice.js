import { UPLOADER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const UPLOADER_RETURN_PRODUCT_TAG = "UPLOADER_RETURN_PRODUCT";

const uploaderReturnProductsApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: [UPLOADER_RETURN_PRODUCT_TAG],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUploaderReturnProducts: builder.query({
        query: () => UPLOADER_API.RETURN_PRODUCT_GET,
        providesTags: [UPLOADER_RETURN_PRODUCT_TAG],
      }),
      addUploaderReturnProductsSetPolka: builder.mutation({
        query: (body) => ({
          url: UPLOADER_API.RETURN_PRODUCT_SET_POLKA_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [UPLOADER_RETURN_PRODUCT_TAG],
      }),
    }),
  });

export const {
  useGetUploaderReturnProductsQuery,
  useAddUploaderReturnProductsSetPolkaMutation,
} = uploaderReturnProductsApiSlice;

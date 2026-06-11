import { UPLOADER_API } from "../../app/api/api";
import { apiSlice } from "../../app/api/apiSlice";

const UPLOADER_TAG = "UPLOADER";

const uploaderApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [UPLOADER_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUploaderAllProducts: builder.query({
        query: () => UPLOADER_API.PRODUCTS_GET,
      }),
      getUploaderSpareProducts: builder.query({
        query: () => UPLOADER_API.UPLOADER_SPARE_PRODUCTS_GET,
      }),
    }),
  });

export const {
  useGetUploaderAllProductsQuery,
  useGetUploaderSpareProductsQuery,
} = uploaderApiSlice;

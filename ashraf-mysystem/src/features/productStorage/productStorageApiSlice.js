import { PRODUCT_STORAGE } from "../../app/api/api";
import { apiSlice } from "../../app/api/apiSlice";

const PRODUCT_STORAGE_TAG = "PRODUCT_STORAGE";

export const productStoragePolkaApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [PRODUCT_STORAGE_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      /* Report */
      getProductStorageReport: builder.mutation({
        query: ({ providerId, start, end }) => ({
          url: PRODUCT_STORAGE.REPORT_GET({ providerId, start, end }),
          method: "GET",
        }),
      }),
      getProductStorageReportAll: builder.mutation({
        query: ({ providerId, start, end }) => ({
          url: PRODUCT_STORAGE.REPORT_ALL_GET({ providerId, start, end }),
          method: "GET",
        }),
      }),
      getProductStorageReportDetail: builder.mutation({
        query: ({ id, status }) => ({
          url: PRODUCT_STORAGE.REPORT_DETAIL_GET({ id, status }),
          method: "GET",
        }),
      }),

      getProductStorageSpare: builder.query({
        query: () => PRODUCT_STORAGE.SPARE_GET,
      }),
    }),
  });

export const {
  useGetProductStorageReportMutation,
  useGetProductStorageReportAllMutation,
  useGetProductStorageReportDetailMutation,

  useGetProductStorageSpareQuery,
} = productStoragePolkaApiSlice;

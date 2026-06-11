import {UPLOADER_API} from "../../../app/api/api";
import {apiSlice} from "../../../app/api/apiSlice";

const UPLOADER_REPORT_PRODUCT_TAG = "UPLOADER_REPORT_PRODUCT";

const uploaderReturnProductsApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: [UPLOADER_REPORT_PRODUCT_TAG],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUploaderReport: builder.query({
        query: () => UPLOADER_API.REPORT_GET,
        providesTags: [UPLOADER_REPORT_PRODUCT_TAG],
      }),
      getUploaderReportPateriya: builder.mutation({
        query: (date) => ({
          url: UPLOADER_API.REPORT_PATERIYA_GET_BY_DATE(date),
          method: "GET",
        }),
      }),
      getUploaderReportReceptionByDate: builder.mutation({
        query: (date) => ({
          url: UPLOADER_API.REPORT_RECEPTION_GET_BY_DATE(date),
          method: "GET",
        }),
      }),
      getUploaderReportAllByDate: builder.mutation({
        query: ({start, end}) => ({
          url: UPLOADER_API.REPORT_ALL_GET({start, end}),
          method: "GET",
        }),
        providesTags: [UPLOADER_REPORT_PRODUCT_TAG],
      }),
      getUploaderReportOutputsByDate: builder.mutation({
        query: ({start, end}) => ({
          url: UPLOADER_API.REPORT_OUTPUTS_GET_BY_DATE({start, end}),
          method: "GET",
        }),
      }),
      getUploaderReportOutputsItemMore: builder.mutation({
        query: ({start, end, itemId}) => ({
          url: UPLOADER_API.REPORT_OUTPUTS_ITEM_MORE_GET({start, end, itemId}),
          method: "GET",
        }),
      }),
    }),
  });

export const {
  useGetUploaderReportQuery,
  useGetUploaderReportPateriyaMutation,
  useGetUploaderReportReceptionByDateMutation,
  useGetUploaderReportAllByDateMutation,
  useGetUploaderReportOutputsByDateMutation,
  useGetUploaderReportOutputsItemMoreMutation,
} = uploaderReturnProductsApiSlice;

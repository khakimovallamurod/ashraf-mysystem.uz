import { UPLOADER_API } from "../../../../app/api/api";
import { apiSlice } from "../../../../app/api/apiSlice";

const UPLOADER_ORDER_OF_GRIND_TAG = "UPLOADER_ORDER_OF_GRIND";

export const uploaderOrderOfGrindApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [UPLOADER_ORDER_OF_GRIND_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUploaderOrderGrindInProcess: builder.query({
        query: () => UPLOADER_API.GRIND_ORDER_IN_PROCESS_GET,
        providesTags: [UPLOADER_ORDER_OF_GRIND_TAG],
      }),
      //QR data
      getUploaderQrData: builder.mutation({
        query: (qrVal) => ({
          url: UPLOADER_API.QR_CODE_DATA_GET(qrVal),
          method: "GET",
        }),
        providesTags: [UPLOADER_ORDER_OF_GRIND_TAG],
      }),
      addUploaderOrderGrindConfirm: builder.mutation({
        query: (id) => ({
          url: UPLOADER_API.GRIND_ORDER_CONFIRM_ADD(id),
          method: "PUT",
        }),
        invalidatesTags: [UPLOADER_ORDER_OF_GRIND_TAG],
      }),
      addUploaderSetPolka: builder.mutation({
        query: (body) => ({
          url: UPLOADER_API.SET_POLKA_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [UPLOADER_ORDER_OF_GRIND_TAG],
      }),
    }),
  });

export const {
  useGetUploaderOrderGrindInProcessQuery,
  useGetUploaderQrDataMutation,
  useAddUploaderOrderGrindConfirmMutation,
  useAddUploaderSetPolkaMutation,
} = uploaderOrderOfGrindApiSlice;

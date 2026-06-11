import { UPLOADER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const UPLOADER_REGRIND_TAG = "UPLOADER_REGRIND";
const UPLOADER_REGRIND_POLKA_TAG = "UPLOADER_REGRIND_POLKA";

const uploaderPolkaApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: [UPLOADER_REGRIND_TAG, UPLOADER_REGRIND_POLKA_TAG],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUploaderRegrindList: builder.query({
        query: () => UPLOADER_API.REGRIND_GET,
        providesTags: [UPLOADER_REGRIND_TAG],
      }),
      getUploaderRegrindInProccess: builder.query({
        query: () => UPLOADER_API.REGRIND_IN_PROCESS_GET,
        providesTags: [UPLOADER_REGRIND_POLKA_TAG],
      }),
      addUploaderRegrind: builder.mutation({
        query: (body) => ({
          url: UPLOADER_API.REGRINT_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [UPLOADER_REGRIND_TAG],
      }),
      addUploaderRegrindConfirm: builder.mutation({
        query: (id) => ({
          url: UPLOADER_API.REGIRIND_CONFIRM_ADD(id),
          method: "PUT",
        }),
        invalidatesTags: [UPLOADER_REGRIND_TAG],
      }),
      /* Put Polka */
      addUploaderRegrindSetPolka: builder.mutation({
        query: (body) => ({
          url: UPLOADER_API.REGRIND_SET_POLKA_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [UPLOADER_REGRIND_POLKA_TAG],
      }),
    }),
  });

export const {
  useGetUploaderRegrindListQuery,
  useGetUploaderRegrindInProccessQuery,
  useAddUploaderRegrindMutation,
  useAddUploaderRegrindConfirmMutation,
  useAddUploaderRegrindSetPolkaMutation,
} = uploaderPolkaApiSlice;

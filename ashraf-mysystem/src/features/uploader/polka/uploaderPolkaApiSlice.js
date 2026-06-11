import { UPLOADER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const UPLOADER_POLKA_TAG = "UPLOADER_POLKA";

const uploaderPolkaApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [UPLOADER_POLKA_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUploaderPart: builder.query({
        query: () => UPLOADER_API.PART_GET,
      }),
      getUploaderPolka: builder.query({
        query: () => UPLOADER_API.POLKA_GET,
      }),
      getUploaderPolkaDataByPart: builder.mutation({
        query: (partId) => ({
          url: UPLOADER_API.POLKA_DATA_GET_BY_PART(partId),
          method: "GET",
        }),
      }),
      getUploaderPartiyaByPolka: builder.mutation({
        query: (polkaId) => ({
          url: UPLOADER_API.PARTIYA_GET_BY_POLKA(polkaId),
          method: "GET",
        }),
      }),
      getUploaderPolkaByPart: builder.mutation({
        query: (partId) => ({
          url: UPLOADER_API.POLKA_GET_BY_PART(partId),
          method: "GET",
        }),
      }),
      putUploaderPolkaReplace: builder.mutation({
        query: (body) => ({
          url: UPLOADER_API.POLKA_REPLACE_PUT,
          method: "PUT",
          body,
        }),
      }),
    }),
  });

export const {
  useGetUploaderPartQuery,
  useGetUploaderPolkaQuery,
  useGetUploaderPolkaDataByPartMutation,
  useGetUploaderPartiyaByPolkaMutation,
  useGetUploaderPolkaByPartMutation,
  usePutUploaderPolkaReplaceMutation,
} = uploaderPolkaApiSlice;

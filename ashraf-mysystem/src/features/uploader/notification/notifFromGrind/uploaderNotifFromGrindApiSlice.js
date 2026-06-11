import { UPLOADER_API } from "../../../../app/api/api";
import { apiSlice } from "../../../../app/api/apiSlice";

const UPLOADER_NOTIF_FROM_GRIND_TAG = "UPLOADER_NOTIF_FROM_GRIND";

export const uploaderNotifFromGrindApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [UPLOADER_NOTIF_FROM_GRIND_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUploaderNotifMessageFromGrind: builder.query({
        query: () => UPLOADER_API.NOTIF_MESSAGE_FROM_GRIND_GET,
        invalidatesTags: [UPLOADER_NOTIF_FROM_GRIND_TAG],
      }),
      getUploaderNotifListFromGrind: builder.query({
        query: () => UPLOADER_API.NOTIF_LIST_FROM_GRIND_GET,
        invalidatesTags: [UPLOADER_NOTIF_FROM_GRIND_TAG],
      }),
    }),
  });

export const {
  useGetUploaderNotifMessageFromGrindQuery,
  useGetUploaderNotifListFromGrindQuery,
} = uploaderNotifFromGrindApiSlice;

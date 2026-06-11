import { PRODUCT_STORAGE } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const PRODUCT_STORAGE_NOTIF_TAG = "PRODUCT_STORAGE_NOTIF";
const STORAGE_NOTIF_FROM_RECEPTION_TAG = "STORAGE_NOTIF_FROM_RECEPTION"
const STORAGE_NOTIF_FROM_STORAGE_TAG = "STORAGE_NOTIF_FROM_STORAGE"

export const storageNotifcationApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [PRODUCT_STORAGE_NOTIF_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      /* Reception */
      getStorageNotifMessageFromReception: builder.query({
        query: () => PRODUCT_STORAGE.NOTIF_FROM_RECEPTION_GET,
        providesTags: [STORAGE_NOTIF_FROM_RECEPTION_TAG],
      }),
      getStorageNotifListFromReception: builder.query({
        query: () => PRODUCT_STORAGE.NOTIF_LIST_FROM_RECEPTION_GET,
        providesTags: [STORAGE_NOTIF_FROM_RECEPTION_TAG],
      }),
      /* Grind */
      getStorageNotifMessageFromGrind: builder.query({
        query: () => PRODUCT_STORAGE.NOTIF_FROM_GRIND_GET,
        providesTags: [STORAGE_NOTIF_FROM_STORAGE_TAG],
      }),
      getStorageNotifListFromGrind: builder.query({
        query: () => PRODUCT_STORAGE.NOTIF_LIST_FROM_GRIND_GET,
        providesTags: [STORAGE_NOTIF_FROM_STORAGE_TAG],
      }),
    }),
  });

export const {
  /* Reception */
  useGetStorageNotifMessageFromReceptionQuery,
  useGetStorageNotifListFromReceptionQuery,
  /* Grind */
  useGetStorageNotifMessageFromGrindQuery,
  useGetStorageNotifListFromGrindQuery,
} = storageNotifcationApiSlice;

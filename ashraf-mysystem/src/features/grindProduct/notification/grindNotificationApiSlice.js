import { GRIND_PRODUCT_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const GRIND_NOTIF_TAG_FROM_SALES = "GRIND_NOTIF_FROM_SALES";
const GRIND_NOTIF_TAG_FROM_STORAGE = "GRIND_NOTIF_FROM_STORAGE";

export const grindNotificationApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: [GRIND_NOTIF_TAG_FROM_SALES, GRIND_NOTIF_TAG_FROM_STORAGE],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      /* Sales */
      getGrindNotifMessageFromSales: builder.query({
        query: () => GRIND_PRODUCT_API.NOTIF_FROM_SALES_GET,
        providesTags: GRIND_NOTIF_TAG_FROM_SALES,
      }),
      getGrindNotifListFromSales: builder.query({
        query: () => GRIND_PRODUCT_API.NOTIF_LIST_FROM_SALES_GET,
        providesTags: GRIND_NOTIF_TAG_FROM_SALES,
      }),
      /* Storage */
      getGrindNotifMessageFromStorage: builder.query({
        query: () => GRIND_PRODUCT_API.NOTIF_FROM_STORAGE_GET,
        providesTags: GRIND_NOTIF_TAG_FROM_STORAGE,
      }),
      getGrindNotifListFromStorage: builder.query({
        query: () => GRIND_PRODUCT_API.NOTIF_LIST_FROM_STORAGE_GET,
        providesTags: GRIND_NOTIF_TAG_FROM_STORAGE,
      }),
    }),
  });

export const {
  /* Sales */
  useGetGrindNotifMessageFromSalesQuery,
  useGetGrindNotifListFromSalesQuery,
  /* Storage */
  useGetGrindNotifMessageFromStorageQuery,
  useGetGrindNotifListFromStorageQuery
} = grindNotificationApiSlice;

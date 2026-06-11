import { UPLOADER_API } from "../../../../app/api/api";
import { apiSlice } from "../../../../app/api/apiSlice";
import { UPLOADER_ORDER_OF_SALES_TAG } from "../../order/orderOfSales/uploaderOrderOfSalesApiSlice";

const UPLOADER_NOTIF_FROM_SALES_TAG = "UPLOADER_NOTIF_FROM_SALES";

export const uploaderNorifFromSalesApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [UPLOADER_NOTIF_FROM_SALES_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUploaderNotifMessageFromSales: builder.query({
        query: () => UPLOADER_API.NOTIF_MESSAGE_FROM_SALES_GET,
        providesTags: [UPLOADER_NOTIF_FROM_SALES_TAG],
      }),
      getUploaderNotifListFromSales: builder.query({
        query: () => UPLOADER_API.NOTIF_LIST_FROM_SALES_GET,
        providesTags: [UPLOADER_NOTIF_FROM_SALES_TAG],
      }),
      addUploaderCloseOrderNotifItem: builder.mutation({
        query: (body) => ({
          url: UPLOADER_API.ORDER_CLOSE_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [
          UPLOADER_NOTIF_FROM_SALES_TAG,
          UPLOADER_ORDER_OF_SALES_TAG,
        ],
      }),
    }),
  });

export const {
  useGetUploaderNotifMessageFromSalesQuery,
  useGetUploaderNotifListFromSalesQuery,
  useAddUploaderCloseOrderNotifItemMutation,
} = uploaderNorifFromSalesApiSlice;

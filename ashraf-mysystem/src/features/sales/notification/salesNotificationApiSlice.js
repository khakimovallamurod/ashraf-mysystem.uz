import { SALES_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const SALES_NOTIF_FROM_UPLOADER_TAG = "SALES_NOTIF_FROM_UPLOADER";

export const salesNotificationApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: [SALES_NOTIF_FROM_UPLOADER_TAG],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSalesNotifMessageFromUploader: builder.query({
        query: () => SALES_API.NOTIF_MESSAGE_FROM_UPLOADER_GET,
        providesTags: [SALES_NOTIF_FROM_UPLOADER_TAG],
      }),
      getSalesNotifListFromUploader: builder.query({
        query: () => SALES_API.NOTIF_LIST_FROM_UPLOADER_GET,
        providesTags: [SALES_NOTIF_FROM_UPLOADER_TAG],
      }),
      getSalesCancelOrderHistory: builder.query({
        query: (date) => SALES_API.CANCELED_ORDER_HISTORY_GET_BY_DATE(date),
        providesTags: [SALES_NOTIF_FROM_UPLOADER_TAG],
      }),
      putSalesNotifUploaderOrderConfirm: builder.mutation({
        query: ({ id }) => ({
          url: SALES_API.UPLOADER_ORDER_CONFIRM_PUT(id),
          method: "PUT",
        }),
        invalidatesTags: [SALES_NOTIF_FROM_UPLOADER_TAG],
      }),
    }),
  });

export const {
  useGetSalesNotifMessageFromUploaderQuery,
  useGetSalesNotifListFromUploaderQuery,
  useGetSalesCancelOrderHistoryQuery,
  usePutSalesNotifUploaderOrderConfirmMutation,
} = salesNotificationApiSlice;

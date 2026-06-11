import { SUPPLIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const SUPPLIER_NOTIF_FROM_ME_TAG = "SUPPLIER_NOTIF_FROM_ME";
const SUPPLIER_NOTIF_FROM_SALES_TAG = "SUPPLIER_NOTIF_FROM_SALES";

export const supplierNotificationApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [SUPPLIER_NOTIF_FROM_SALES_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      /* Me */
      getSupplierNotifMessageForMe: builder.query({
        query: () => SUPPLIER_API.NOTIF_MESSAGE_FROM_ME_GET,
        providesTags: [SUPPLIER_NOTIF_FROM_ME_TAG],
      }),
      getSupplierNotifListForMe: builder.query({
        query: () => SUPPLIER_API.NOTIF_LIST_FROM_ME_GET,
        providesTags: [SUPPLIER_NOTIF_FROM_ME_TAG],
      }),

      /* Reception */
      getSupplierNotifMessageFromSales: builder.query({
        query: () => SUPPLIER_API.NOTIF_MESSAGE_FROM_SALES_GET,
        providesTags: [SUPPLIER_NOTIF_FROM_SALES_TAG],
      }),
      getSupplierNotifListFromSales: builder.query({
        query: () => SUPPLIER_API.NOTIF_LIST_FROM_SALES_GET,
        providesTags: [SUPPLIER_NOTIF_FROM_SALES_TAG],
      }),
    }),
  });

export const {
  useGetSupplierNotifMessageForMeQuery,
  useGetSupplierNotifListForMeQuery,

  useGetSupplierNotifMessageFromSalesQuery,
  useGetSupplierNotifListFromSalesQuery,
} = supplierNotificationApiSlice;

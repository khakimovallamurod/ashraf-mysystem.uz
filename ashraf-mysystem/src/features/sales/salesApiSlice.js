import { SALES_API } from "../../app/api/api";
import { apiSlice } from "../../app/api/apiSlice";
import { SALES_ORDER_HISTORY_TAG } from "./orderHistory/salesOrderHistoryApiSlice";

const SALES_TAG = "SALES_TAG";

export const salesApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [SALES_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      /* Report */
      getSalesReport: builder.mutation({
        query: ({ customerId, start, end }) => ({
          url: SALES_API.REPORT_GET({ customerId, start, end }),
          method: "GET",
        }),
      }),
      getSalesReportAll: builder.mutation({
        query: ({ start, end, supplier }) => ({
          url: SALES_API.REPORT_ALL_GET({ start, end, supplier }),
          method: "GET",
        }),
      }),
      getSalesReportDetail: builder.mutation({
        query: ({ id, status }) => ({
          url: SALES_API.REPORT_DETAIL_GET({ id, status }),
          method: "GET",
        }),
      }),
      getSalesReportCustomer: builder.mutation({
        query: ({ start, end, supplier }) => ({
          url: SALES_API.REPORT_CUSTOMER_GET({ start, end, supplier }),
          method: "GET",
        }),
      }),

      /* Products */
      getSalesProducts: builder.query({
        query: () => SALES_API.PRODUCT_GET,
      }),
      getSalesRegion: builder.query({
        query: () => SALES_API.REGION_GET,
      }),
      getSalesDistrict: builder.mutation({
        query: (regionId) => ({
          url: SALES_API.DISTRICT_GET(regionId),
          method: "GET",
        }),
      }),
      addSalesPlacingOrderToGrind: builder.mutation({
        query: (body) => ({
          url: SALES_API.PLACING_ORDER_TO_GRIND,
          method: "POST",
          body,
        }),
        invalidatesTags: [SALES_TAG],
      }),
      addSalesPlacingOrderToUploader: builder.mutation({
        query: (body) => ({
          url: SALES_API.PLACING_ORDER_TO_UPLOADER,
          method: "POST",
          body,
        }),
      }),

      /* PRINT CHEK */
      putSalesPrintChekConfirm: builder.mutation({
        query: ({ orderId }) => ({
          url: SALES_API.PRINT_CHEK_CONFIRM(orderId),
          method: "PUT",
        }),
        invalidatesTags: [SALES_ORDER_HISTORY_TAG],
      }),
    }),
  });

export const {
  useGetSalesReportMutation,
  useGetSalesReportAllMutation,
  useGetSalesReportDetailMutation,
  useGetSalesReportCustomerMutation,

  useGetSalesProductsQuery,
  useGetSalesRegionQuery,
  useGetSalesDistrictMutation,
  useAddSalesPlacingOrderToGrindMutation,
  useAddSalesPlacingOrderToUploaderMutation,

  usePutSalesPrintChekConfirmMutation,
} = salesApiSlice;

import { UPLOADER_API } from "../../../../app/api/api";
import { apiSlice } from "../../../../app/api/apiSlice";

export const UPLOADER_ORDER_OF_SALES_TAG = "UPLOADER_ORDER_OF_SALES";

export const uploaderOrderOfSalesApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [UPLOADER_ORDER_OF_SALES_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUploaderOrderSalesInProcess: builder.query({
        query: () => UPLOADER_API.SALES_ORDER_IN_PROCESS_GET,
        providesTags: [UPLOADER_ORDER_OF_SALES_TAG],
      }),
      addUploaderOrderSalesConfirm: builder.mutation({
        query: (id) => ({
          url: UPLOADER_API.SALES_ORDER_CONFIRM_ADD(id),
          method: "PUT",
        }),
        invalidatesTags: [UPLOADER_ORDER_OF_SALES_TAG],
      }),
      addUploaderOrderSalesGive: builder.mutation({
        query: (body) => ({
          url: UPLOADER_API.SALES_GIVE_ORDER,
          method: "POST",
          body,
        }),
        invalidatesTags: [UPLOADER_ORDER_OF_SALES_TAG],
      }),
      addUploaderOrderSalesEnd: builder.mutation({
        query: (body) => ({
          url: UPLOADER_API.SALES_END_ORDER_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [UPLOADER_ORDER_OF_SALES_TAG],
      }),

      putUploaderOrderSalesChangeOrderSupplier: builder.mutation({
        query: ({ orderId, body }) => ({
          url: UPLOADER_API.SALES_CHANGE_ORDER_SUPPLIER_PUT(orderId),
          method: "PUT",
          body,
        }),
        invalidatesTags: [UPLOADER_ORDER_OF_SALES_TAG],
      }),
    }),
  });

export const {
  useGetUploaderOrderSalesInProcessQuery,
  useAddUploaderOrderSalesConfirmMutation,
  useAddUploaderOrderSalesGiveMutation,
  useAddUploaderOrderSalesEndMutation,
  usePutUploaderOrderSalesChangeOrderSupplierMutation,
} = uploaderOrderOfSalesApiSlice;

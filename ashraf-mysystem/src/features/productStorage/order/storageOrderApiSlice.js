import { PRODUCT_STORAGE } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const PRODUCT_STORAGE_ORDER_TAG = "PRODUCT_STORAGE_ORDER";
const PRODUCT_STORAGE_POLKA_TAG = "PRODUCT_STORAGE_POLKA";

export const storageOrderApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: [PRODUCT_STORAGE_ORDER_TAG],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      /* PUT POLKA */
      addOrderPutPolkaStorage: builder.mutation({
        query: (body) => ({
          url: PRODUCT_STORAGE.POLKA_PUT,
          method: "POST",
          body,
        }),
        invalidatesTags: [PRODUCT_STORAGE_ORDER_TAG, PRODUCT_STORAGE_POLKA_TAG],
      }),
      /* RECEPTION */
      getOrderUploadingStorage: builder.query({
        query: () => PRODUCT_STORAGE.ORDER_UPLOADING_GET_FROM_RECEPTION,
        providesTags: [PRODUCT_STORAGE_ORDER_TAG],
      }),
      getOrderCompletedStorageByDate: builder.mutation({
        query: ({ start, end }) => ({
          url: PRODUCT_STORAGE.ORDER_COMPLETED_GET_FROM_RECEPTION_BY_DATE({
            start,
            end,
          }),
          method: "GET",
        }),
        providesTags: [PRODUCT_STORAGE_ORDER_TAG],
      }),
      getOrderReceptionByIdStorage: builder.mutation({
        query: (id) => ({
          url: PRODUCT_STORAGE.ORDER_RECEPTION_GET_BY_POLKA(id),
          method: "GET",
        }),
        providesTags: [PRODUCT_STORAGE_ORDER_TAG],
      }),
      addOrderConfirmStorage: builder.mutation({
        query: (id) => ({
          url: PRODUCT_STORAGE.ORDER_CONFIRM_FROM_RECEPTION(id),
          method: "PUT",
        }),
        invalidatesTags: [PRODUCT_STORAGE_ORDER_TAG],
      }),
      /* GRIND */
      getOrderUploadingFromGrindStorage: builder.query({
        query: () => PRODUCT_STORAGE.ORDER_UPLOADING_GET_FROM_GRIND,
        providesTags: [PRODUCT_STORAGE_ORDER_TAG],
      }),
      getOrderCompletedFromGrindStorage: builder.mutation({
        query: ({ start, end }) => ({
          url: PRODUCT_STORAGE.ORDER_COMPLETED_GET_FROM_GRIND_BY_DATE({
            start,
            end,
          }),
          method: "GET",
        }),
        providesTags: [PRODUCT_STORAGE_ORDER_TAG],
      }),
      addOrderConfirmFromGrindStorage: builder.mutation({
        query: (id) => ({
          url: PRODUCT_STORAGE.ORDER_CONFIRM_FROM_GRIND(id),
          method: "PUT",
        }),
        invalidatesTags: [PRODUCT_STORAGE_ORDER_TAG],
      }),
      sendOrderProductToGrindStorage: builder.mutation({
        query: (body) => ({
          url: PRODUCT_STORAGE.ORDER_SEND_PRODUCT_TO_GRIND,
          method: "POST",
          body,
        }),
        invalidatesTags: [PRODUCT_STORAGE_ORDER_TAG],
      }),
    }),
  });

export const {
  /* Put polka */
  useAddOrderPutPolkaStorageMutation,
  /* Reception */
  useGetOrderUploadingStorageQuery,
  useGetOrderCompletedStorageByDateMutation,
  useGetOrderReceptionByIdStorageMutation,
  useAddOrderConfirmStorageMutation,
  /* Grind */
  useGetOrderUploadingFromGrindStorageQuery,
  useGetOrderCompletedFromGrindStorageMutation,
  useAddOrderConfirmFromGrindStorageMutation,
  useSendOrderProductToGrindStorageMutation,
} = storageOrderApiSlice;

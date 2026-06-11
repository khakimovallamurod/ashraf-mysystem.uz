import { GRIND_PRODUCT_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";
import { GRIND_ORDER_SALES_TAG } from "./grindOrderSalesApiSlice";

const GRIND_ORDER_STORAGE_TAG = "GRIND_ORDER_STORAGE";
const GRIND_RPODUCT_OUT_TAG = "GRIND_RPODUCT_OUT";

export const grindOrderStorageApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: [GRIND_ORDER_STORAGE_TAG, GRIND_RPODUCT_OUT_TAG],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getGrindOrderStorageInProcess: builder.query({
        query: () => GRIND_PRODUCT_API.STORAGE_IN_PROCESS_ORDER,
        providesTags: [GRIND_ORDER_STORAGE_TAG, GRIND_ORDER_SALES_TAG],
      }),
      getGrindWorkers: builder.query({
        query: () => GRIND_PRODUCT_API.GET_WORKERS,
        providesTags: [GRIND_ORDER_STORAGE_TAG],
      }),
      addGrindOutProduct: builder.mutation({
        query: (body) => ({
          url: GRIND_PRODUCT_API.GRIND_OUT,
          method: "POST",
          body,
        }),
        invalidatesTags: [GRIND_ORDER_STORAGE_TAG],
      }),
      addGrindOrderStorageConfirm: builder.mutation({
        query: ({ id, body }) => ({
          url: GRIND_PRODUCT_API.STORAGE_ORDER_CONFIRM_ADD(id),
          method: "PUT",
          body,
        }),
        invalidatesTags: [GRIND_ORDER_STORAGE_TAG],
      }),
      addGrindOrderStorageClose: builder.mutation({
        query: (body) => ({
          url: GRIND_PRODUCT_API.STORAGE_ORDER_CLOSE_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [GRIND_ORDER_STORAGE_TAG],
      }),
      /* Out product */
      getGrindProductOutFromGrind: builder.query({
        query: ({ start, end }) =>
          GRIND_PRODUCT_API.GRIND_OUT_PRODUCT({ start, end }),
        providesTags: [GRIND_ORDER_STORAGE_TAG, GRIND_RPODUCT_OUT_TAG],
      }),
      getGrindProductOutItem: builder.mutation({
        query: ({ partiyaId, productId }) => ({
          url: GRIND_PRODUCT_API.GET_OUT_PRODUCT_ITEM_GET({
            partiyaId,
            productId,
          }),
          method: "GET",
        }),
        invalidatesTags: [GRIND_ORDER_STORAGE_TAG, GRIND_RPODUCT_OUT_TAG],
      }),
      deleteGrindProductOutItem: builder.mutation({
        query: (id) => ({
          url: GRIND_PRODUCT_API.GRIND_OUT_PRODUCT_DELETE(id),
          method: "DELETE",
        }),
        invalidatesTags: [GRIND_ORDER_STORAGE_TAG, GRIND_RPODUCT_OUT_TAG],
      }),
    }),
  });

export const {
  useGetGrindOrderStorageInProcessQuery,
  useGetGrindWorkersQuery,
  useAddGrindOrderStorageConfirmMutation,
  useAddGrindOrderStorageCloseMutation,
  /* Out product */
  useAddGrindOutProductMutation,
  useGetGrindProductOutFromGrindQuery,
  useGetGrindProductOutItemMutation,
  useDeleteGrindProductOutItemMutation,
} = grindOrderStorageApiSlice;

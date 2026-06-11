import { GRIND_PRODUCT_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

export const GRIND_ORDER_SALES_TAG = 'GRIND_ORDER_SALES';

export const grindOrderSalesApiSlice = apiSlice
.enhanceEndpoints({addTagTypes: [GRIND_ORDER_SALES_TAG]})
.injectEndpoints({
  endpoints: (builder) => ({
    getGrindOrderSalesInProcess: builder.query({
      query: () => GRIND_PRODUCT_API.SALES_IN_PROCESS_ORDER,
      providesTags: [GRIND_ORDER_SALES_TAG],
    }),
    addGrindPlacingOrderToStorage: builder.mutation({
      query: (body) => ({
        url: GRIND_PRODUCT_API.PLACING_ORDER_TO_STORAGE,
        method: "POST",
        body,
      }),
      invalidatesTags: [GRIND_ORDER_SALES_TAG],
    }),
    addGrindOrderSalesConfirm: builder.mutation({
      query: (id) => ({
        url: GRIND_PRODUCT_API.SALES_ORDER_CONFIRM_ADD(id),
        method: 'PUT',
      }),
      invalidatesTags: [GRIND_ORDER_SALES_TAG],
    })
  })
})

export const {
  useGetGrindOrderSalesInProcessQuery,
  useAddGrindPlacingOrderToStorageMutation,
  useAddGrindOrderSalesConfirmMutation,
} = grindOrderSalesApiSlice
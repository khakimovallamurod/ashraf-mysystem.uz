import { GRIND_PRODUCT_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const GRIND_REGRIND_TAG = "GRIND_REGRIND";
const GRIND_REGRIND_IN_PROGRESS_TAG = "GRIND_REGRIND_IN_PROGRESS";

export const grindRegrindApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: [GRIND_REGRIND_TAG, GRIND_REGRIND_IN_PROGRESS_TAG],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getGrindRegrind: builder.query({
        query: () => GRIND_PRODUCT_API.REGRIND_LIST,
        providesTags: [GRIND_REGRIND_TAG],
      }),
      getGrindRegrindHistory: builder.query({
        query: ({start,end}) => GRIND_PRODUCT_API.REGRIND_LIST_HISTORY_GET({start,end}),
        providesTags: [GRIND_REGRIND_TAG],
      }),
      getGrindRegrindInProcess: builder.query({
        query: () => GRIND_PRODUCT_API.REGRIND_IN_PROGRESS,
        providesTags: [GRIND_REGRIND_TAG, GRIND_REGRIND_IN_PROGRESS_TAG],
      }),
      addGrindRegrind: builder.mutation({
        query: (body) => ({
          url: GRIND_PRODUCT_API.REGRIND_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [GRIND_REGRIND_IN_PROGRESS_TAG],
      }),
      addGrindRegrindConfirm: builder.mutation({
        query: ({ orderId, body }) => ({
          url: GRIND_PRODUCT_API.REGRIND_CONFIRM(orderId),
          method: "PUT",
          body,
        }),
        invalidatesTags: [GRIND_REGRIND_TAG, GRIND_REGRIND_IN_PROGRESS_TAG],
      }),
      addGrindRegrindOrderClose: builder.mutation({
        query: (body) => ({
          url: GRIND_PRODUCT_API.REGRIND_CLOSE_ORDER_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [GRIND_REGRIND_TAG, GRIND_REGRIND_IN_PROGRESS_TAG],
      }),
    }),
  });

export const {
  useGetGrindRegrindQuery,
  useGetGrindRegrindHistoryQuery,
  useGetGrindRegrindInProcessQuery,
  useAddGrindRegrindMutation,
  useAddGrindRegrindConfirmMutation,
  useAddGrindRegrindOrderCloseMutation,
} = grindRegrindApiSlice;

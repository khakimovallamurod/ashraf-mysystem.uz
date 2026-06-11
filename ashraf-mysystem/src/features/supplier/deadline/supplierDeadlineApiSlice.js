import {SUPPLIER_API} from "../../../app/api/api";
import {apiSlice} from "../../../app/api/apiSlice";

const SUPPLIER_DEADLINE_TAG = "SUPPLIER_DEADLINE_TAG";

export const supplierDeadLineApiSlice = apiSlice
  .enhanceEndpoints({addTagTypes: [SUPPLIER_DEADLINE_TAG]})
  .injectEndpoints({
    endpoints: (builder) => ({
      getSupplierDeadline: builder.query({
        query: () => SUPPLIER_API.DEADLINE_GET,
      }),
      // deadline up
      addSupplierDeadlineUp: builder.mutation({
        query: ({deadlineId, date}) => ({
          url: SUPPLIER_API.DEADLINE_UP_GET(deadlineId, date),
          method: "GET",
        }),
        invalidatesTags: [SUPPLIER_DEADLINE_TAG],
      }),
      // confirm sms
      addSupplierDeadlineConfirmSms: builder.mutation({
        query: ({smsCode, deadlineId}) => ({
          url: SUPPLIER_API.SMS_CODE_CONFIRM_GET(smsCode, deadlineId),
          method: "GET",
        }),
      }),
      addSupplierDeadlineClose: builder.mutation({
        query: (body) => ({
          url: SUPPLIER_API.DEADLINE_CLOSE_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [SUPPLIER_DEADLINE_TAG],
      }),
    }),
  });

export const {
  useGetSupplierDeadlineQuery,
  useAddSupplierDeadlineUpMutation,
  useAddSupplierDeadlineConfirmSmsMutation,
  useAddSupplierDeadlineCloseMutation
} = supplierDeadLineApiSlice;

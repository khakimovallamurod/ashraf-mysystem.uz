import { SUPPLIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const SUPPLIER_ORDER_SMS_TAG = "SUPPLIER_ORDER_SMS";

export const supplierConfirmSmsApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [SUPPLIER_ORDER_SMS_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      addSupplierConfirmSms: builder.mutation({
        query: ({ orderId, body }) => ({
          url: SUPPLIER_API.SMS_CONFIRM_ADD(orderId),
          method: "POST",
          body,
        }),
        invalidatesTags: [SUPPLIER_ORDER_SMS_TAG],
      }),
    }),
  });

export const {
  useGetSupplierOrderSalesInProcessQuery,
  useAddSupplierOrderSalesConfirmMutation,
  useAddSupplierConfirmSmsMutation,
} = supplierConfirmSmsApiSlice;

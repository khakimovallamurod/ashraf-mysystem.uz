import { SKLAD_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const PRODUCT_RECEPTION_TAG = "PRODUCT_RECEPTION";

export const productReceptionApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [PRODUCT_RECEPTION_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      /* Settings */
      getSettings: builder.query({
        query: () => SKLAD_API.SETTINGS_GET,
      }),
      /* Reception */
      getProdRec: builder.query({
        query: () => SKLAD_API.PRODUCT_RECEPTION_GET,
        providesTags: [PRODUCT_RECEPTION_TAG],
      }),
      /* Data by date  */
      getProdRecByDate: builder.mutation({
        query: ({ start, end }) => ({
          url: SKLAD_API.PRODUCT_RECEPTION_GET_BY_DATE({ start, end }),
          method: "GET",
        }),
        providesTags: [PRODUCT_RECEPTION_TAG],
      }),

      addProdRec: builder.mutation({
        query: (body) => ({
          url: SKLAD_API.PRODUCT_RECEPTION_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [PRODUCT_RECEPTION_TAG],
      }),
      sendProdRecSms: builder.mutation({
        query: (body) => ({
          url: SKLAD_API.PRODUCT_RECEPTION_SMS_SEND,
          method: "POST",
          body,
        }),
      }),
      deleteProductReceptionItem: builder.mutation({
        query: (id) => ({
          url: SKLAD_API.PRODUCT_RECEPTION_DEL(id),
          method: "DELETE",
        }),
        invalidatesTags: [PRODUCT_RECEPTION_TAG],
      }),
    }),
  });

export const {
  useGetSettingsQuery,
  useGetProdRecByDateMutation,
  useGetProdRecQuery,
  useAddProdRecMutation,
  useSendProdRecSmsMutation,
  useDeleteProductReceptionItemMutation,
} = productReceptionApiSlice;

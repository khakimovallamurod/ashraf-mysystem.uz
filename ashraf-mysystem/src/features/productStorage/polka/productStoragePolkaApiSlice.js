import { PRODUCT_STORAGE } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const PRODUCT_STORAGE_POLKA_TAG = "PRODUCT_STORAGE_POLKA";

export const productStoragePolkaApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [PRODUCT_STORAGE_POLKA_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getPolkaStorage: builder.query({
        query: () => PRODUCT_STORAGE.POLKA_GET,
        providesTags: [PRODUCT_STORAGE_POLKA_TAG],
      }),
      getPolkaHistoryStorageByDate: builder.mutation({
        query: ({ start, end }) => ({
          url: PRODUCT_STORAGE.POLKA_HISTORY_GET_BY_DATE({
            start,
            end,
          }),
          method: "GET",
        }),
        providesTags: [PRODUCT_STORAGE_POLKA_TAG],
      }),
      getByIdPolkaStorage: builder.query({
        query: (id) => PRODUCT_STORAGE.POLKA_GET_BY_ID(id),
        providesTags: [PRODUCT_STORAGE_POLKA_TAG],
      }),
    }),
  });

export const {
  useGetPolkaStorageQuery,
  useGetByIdPolkaStorageQuery,
  useGetPolkaHistoryStorageByDateMutation,
} = productStoragePolkaApiSlice;

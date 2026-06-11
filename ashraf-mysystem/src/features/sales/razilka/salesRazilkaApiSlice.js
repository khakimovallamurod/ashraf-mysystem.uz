import { SALES_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const RAZILKA_TAG = "SALES_RAZILKA";

export const salesRazilkaApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [RAZILKA_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getRazilkaProducts: builder.query({
        query: () => SALES_API.RAZILKA_PRODUCTS_GET,
      }),
      getRazilkaList: builder.query({
        query: (params) => SALES_API.RAZILKA_GET(params),
        providesTags: [RAZILKA_TAG],
      }),
      addRazilka: builder.mutation({
        query: (body) => ({
          url: SALES_API.RAZILKA_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [RAZILKA_TAG],
      }),
      razilkaOutput: builder.mutation({
        query: (body) => ({
          url: SALES_API.RAZILKA_OUTPUT,
          method: "POST",
          body,
        }),
        invalidatesTags: [RAZILKA_TAG],
      }),
    }),
  });

export const {
  useGetRazilkaProductsQuery,
  useGetRazilkaListQuery,
  useAddRazilkaMutation,
  useRazilkaOutputMutation,
} = salesRazilkaApiSlice;

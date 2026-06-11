import { SKLAD_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const PROVIDER_TAG = "PROVIDER";

export const productProviderApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [PROVIDER_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getProductProvider: builder.query({
        query: () => SKLAD_API.PROVIDER_GET,
        providesTags: [PROVIDER_TAG],
      }),
      getByIdProductProvider: builder.mutation({
        query: (id) => ({
          url:SKLAD_API.PROVIDER_GET_BY_ID(id),
          method: 'GET',
        }),
        providesTags: [PROVIDER_TAG],
      }),
      addProductProvider: builder.mutation({
        query: (body) => ({
          url: SKLAD_API.PROVIDER_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [PROVIDER_TAG],
      }),
      editProductProvider: builder.mutation({
        query: ({id, body}) => ({
          url: SKLAD_API.PROVIDER_EDIT(id),
          method: 'PUT',
          body,
        })
      })
    }),
  });

export const {
  useGetProductProviderQuery,
  useGetByIdProductProviderMutation,
  useAddProductProviderMutation,
  useEditProductProviderMutation
} = productProviderApiSlice;

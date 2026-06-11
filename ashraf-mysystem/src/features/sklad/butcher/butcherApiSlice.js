import { SKLAD_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const BUTCHER_TAG = "BUTCHER";

export const butcherApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [BUTCHER_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getButcher: builder.query({
        query: () => SKLAD_API.BUTCHER_GET,
        providesTags: [BUTCHER_TAG],
      }),
      getByIdButcher: builder.query({
        query: (id) => SKLAD_API.BUTCHER_GET_BY_ID(id),
        providesTags: [BUTCHER_TAG],
      }),
      addButcher: builder.mutation({
        query: (body) => ({
          url: SKLAD_API.BUTCHER_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [BUTCHER_TAG],
      }),
      editButcher: builder.mutation({
        query: ({ id, body }) => ({
          url: SKLAD_API.BUTCHER_EDIT(id),
          method: "PUT",
          body,
        }),
      }),
    }),
  });

export const {
  useGetButcherQuery,
  useGetByIdButcherQuery,
  useAddButcherMutation,
  useEditButcherMutation,
} = butcherApiSlice;

import { PATERIYA_API } from "../../app/api/api";
import { apiSlice } from "../../app/api/apiSlice";

const PATERIYA_TAG = "PATERIYA";

export const pateriyaApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [PATERIYA_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      addPateriya: builder.mutation({
        query: (body) => ({
          url: PATERIYA_API.PATERIYA_ADD,
          method: "POST",
          body,
        }),
      }),
    }),
  });

export const { useAddPateriyaMutation } = pateriyaApiSlice;

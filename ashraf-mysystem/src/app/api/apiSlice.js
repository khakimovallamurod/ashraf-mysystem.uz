import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MAIN_API } from "./api";

const baseUrl = MAIN_API;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    headers.set("Accept", "application/json; charset=UTF-8");
    headers.set("Content-type", "application/json; charset=UTF-8");
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },

  credentials: "same-origin",
});

export const apiSlice = createApi({
  baseQuery,
  endpoints: (build) => ({}),
});

import { AUTH_API } from "../../app/api/api";
import { apiSlice } from "../../app/api/apiSlice";

const AUTH_TAG = "AUTH";

export const authApiSlice = apiSlice
    .enhanceEndpoints({ addTagTypes: [AUTH_TAG] })
    .injectEndpoints({
        endpoints: (builder) => ({
            login: builder.mutation({
                query: (credentials) => ({
                    url: AUTH_API.LOGIN,
                    method: "POST",
                    body: { ...credentials },
                }),
                invalidatesTags: [AUTH_TAG],
            }),
            getUserData: builder.mutation({
                query: () => ({
                    url: AUTH_API.USER_DATA,
                    method: "GET",
                }),
                providesTags: [AUTH_TAG]
            })
        }),
    });

export const { useLoginMutation, useGetUserDataMutation } = authApiSlice;

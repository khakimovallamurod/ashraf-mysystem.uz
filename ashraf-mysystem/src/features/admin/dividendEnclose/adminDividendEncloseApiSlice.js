import { ADMIN_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const ADMIN_DIVIDEND_TAG = "ADMIN_DIVIDEND_ANCLOSE";

export const adminDividendAncloseApiSlice = apiSlice
    .enhanceEndpoints({ addTagTypes: [ADMIN_DIVIDEND_TAG] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getAdminDividendAnclose: builder.query({
                query: () => ADMIN_API.DIVIDEND_ANCLOSE_GET,
                providesTags: [ADMIN_DIVIDEND_TAG],
            }),
            addAdminDividendAnclose: builder.mutation({
                query: (body) => ({
                    url: ADMIN_API.DIVIDEND_ANCLOSE_ADD,
                    method: "POST",
                    body,
                }),
                invalidatesTags: [ADMIN_DIVIDEND_TAG],
            }),

            deleteAdminDividendAnclose: builder.mutation({
                query: (id) => ({
                    url: ADMIN_API.DIVIDEND_DELETE(id),
                    method: "DELETE",
                }),
                invalidatesTags: [ADMIN_DIVIDEND_TAG],
            }),
        }),
    });

export const {
    useGetAdminDividendAncloseQuery,
    useAddAdminDividendAncloseMutation,
    useDeleteAdminDividendAncloseMutation,

} = adminDividendAncloseApiSlice;

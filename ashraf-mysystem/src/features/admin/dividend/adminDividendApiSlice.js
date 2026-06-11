import { ADMIN_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const ADMIN_DIVIDEND_TAG = "ADMIN_DIVIDEND";

export const adminDividendApiSlice = apiSlice
    .enhanceEndpoints({ addTagTypes: [ADMIN_DIVIDEND_TAG] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getAdminDividend: builder.query({
                query: ({ start, end, dividendCategory }) => ADMIN_API.DIVIDEND_GET({
                    start,
                    end,
                    dividendCategory,
                }),
                providesTags: [ADMIN_DIVIDEND_TAG],
            }),
            addAdminDividend: builder.mutation({
                query: (body) => ({
                    url: ADMIN_API.DIVIDEND_ADD,
                    method: "POST",
                    body,
                }),
                invalidatesTags: [ADMIN_DIVIDEND_TAG],
            }),
            getAdminDividendCategory: builder.query({
                query: () => ADMIN_API.DIVIDEND_CATEGORY_GET,
            }),
            deleteAdminDividend: builder.mutation({
                query: (id) => ({
                    url: ADMIN_API.DIVIDEND_DELETE(id),
                    method: "DELETE",
                }),
                invalidatesTags: [ADMIN_DIVIDEND_TAG],
            }),
        }),
    });

export const {
    useGetAdminDividendQuery,
    useAddAdminDividendMutation,
    useDeleteAdminDividendMutation,
    useGetAdminDividendCategoryQuery
} = adminDividendApiSlice;

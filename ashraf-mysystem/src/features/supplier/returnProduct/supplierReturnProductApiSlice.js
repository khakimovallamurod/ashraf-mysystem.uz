import { SUPPLIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const SUPPLIER_RETURN_PRODUCT_TAG = "SUPPLIER_RETURN_PRODUCT";

export const supplierReturnApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [SUPPLIER_RETURN_PRODUCT_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      /* Index */
      getSupplierReturnProduct: builder.query({
        query: () => SUPPLIER_API.RETURN_PRODUCT_GET,
        providesTags: [SUPPLIER_RETURN_PRODUCT_TAG],
      }),
      getSupplierReturnProductHistory: builder.query({
        query: () => SUPPLIER_API.RETURN_PRODUCT_HISTORY_GET,
        providesTags: [SUPPLIER_RETURN_PRODUCT_TAG],
      }),
      /* Add */
      addSupplierReturnProduct: builder.mutation({
        query: (body) => ({
          url: SUPPLIER_API.RETURN_PRODUCT_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [SUPPLIER_RETURN_PRODUCT_TAG],
      }),
      /* Delete */
      deleteSupplierReturnProduct: builder.mutation({
        query: (id) => ({
          url: SUPPLIER_API.RETURN_PRODUCT_DELETE(id),
          method: "DELETE",
        }),
        invalidatesTags: [SUPPLIER_RETURN_PRODUCT_TAG],
      }),
    }),
  });

export const {
  useGetSupplierReturnProductQuery,
  useGetSupplierReturnProductHistoryQuery,
  useAddSupplierReturnProductMutation,
  useDeleteSupplierReturnProductMutation,
} = supplierReturnApiSlice;

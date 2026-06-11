import { SUPPLIER_API } from "../../app/api/api";
import { apiSlice } from "../../app/api/apiSlice";

export const SUPPLIER_TAG = "SUPPLIER";

export const supplierApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [SUPPLIER_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSupplierProducts: builder.query({
        query: () => SUPPLIER_API.GET_PRODUCTS,
      }),

      /* Submitted orders */
      getSupplierSubmittedOrder: builder.query({
        query: () => ({
          url: SUPPLIER_API.SUBMITTED_ORDER_GET,
          method: "GET",
        }),
      }),
    }),
  });

export const {
  useGetSupplierProductsQuery,
  useGetSupplierSubmittedOrderQuery,
} = supplierApiSlice;

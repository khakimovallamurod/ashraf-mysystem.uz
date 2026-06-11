import { CASHIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const CASHIER_COMPLE_DEPART_TAG = "CASHIER_COMPLE_DEPART";

export const cahierCompleDepartProduct = apiSlice
  .enhanceEndpoints({ addTagTypes: [CASHIER_COMPLE_DEPART_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getCashierCompProd: builder.query({
        query: () => CASHIER_API.PRODUCTS_OF_COMPLE_DEPART_GET,
        providesTags: [CASHIER_COMPLE_DEPART_TAG],
      }),
    }),
  });

export const { useGetCashierCompProdQuery } = cahierCompleDepartProduct;

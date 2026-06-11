import { CASHIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const CASHIER_EXPENSES_TAG = "CASHIER_EXPENSES";

export const cashierExpensesApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [CASHIER_EXPENSES_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getCashierExpensesByDate: builder.query({
        query: ({ start, end, expenseCategory }) =>
          CASHIER_API.EXPENSES_GET_BY_DATE({
            start,
            end,
            expenseCategory,
          }),
        providesTags: [CASHIER_EXPENSES_TAG],
      }),
      getCashierExpensesCategory: builder.query({
        query: () => CASHIER_API.EXPENSES_CATEGORY_GET,
      }),
      addCashierExpenses: builder.mutation({
        query: (body) => ({
          url: CASHIER_API.EXPENSES_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [CASHIER_EXPENSES_TAG],
      }),
      deleteCahierExpenses: builder.mutation({
        query: (id) => ({
          url: CASHIER_API.EXPENSES_DELETE(id),
          method: "DELETE",
        }),
        invalidatesTags: [CASHIER_EXPENSES_TAG],
      }),
    }),
  });

export const {
  useGetCashierExpensesByDateQuery,
  useGetCashierExpensesCategoryQuery,
  useAddCashierExpensesMutation,
  useDeleteCahierExpensesMutation,
} = cashierExpensesApiSlice;

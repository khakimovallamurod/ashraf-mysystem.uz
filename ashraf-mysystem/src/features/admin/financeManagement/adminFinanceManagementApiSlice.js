import { ADMIN_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const ADMIN_FINANCE_TAG = "ADMIN_FINANCE";

export const adminFinanceManagementApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [ADMIN_FINANCE_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminFinanceDebts: builder.query({
        query: (params) => ADMIN_API.FINANCE_DEBTS_GET(params),
        providesTags: [ADMIN_FINANCE_TAG],
      }),
      getAdminFinanceExpenses: builder.query({
        query: (params) => ADMIN_API.FINANCE_EXPENSES_GET(params),
        providesTags: [ADMIN_FINANCE_TAG],
      }),
      getAdminFinanceSalary: builder.query({
        query: (params) => ADMIN_API.FINANCE_SALARY_GET(params),
        providesTags: [ADMIN_FINANCE_TAG],
      }),
      addAdminFinanceSalary: builder.mutation({
        query: (body) => ({
          url: ADMIN_API.FINANCE_SALARY_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [ADMIN_FINANCE_TAG],
      }),
    }),
  });

export const {
  useGetAdminFinanceDebtsQuery,
  useGetAdminFinanceExpensesQuery,
  useGetAdminFinanceSalaryQuery,
  useAddAdminFinanceSalaryMutation,
} = adminFinanceManagementApiSlice;

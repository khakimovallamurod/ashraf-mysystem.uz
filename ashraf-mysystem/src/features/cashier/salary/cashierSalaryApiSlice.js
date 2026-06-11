import { CASHIER_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const CASHIER_WORKER_SALARY_TAG = "CASHIER_WORKER_SALARY";
const CASHIER_BUTCHER_SALARY_TAG = "CASHIER_BUTCHER_SALARY";

export const cashierSalaryApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: [CASHIER_WORKER_SALARY_TAG],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      /* WORKER */
      getCashierWorker: builder.query({
        query: () => CASHIER_API.WORKER_GET,
        providesTags: [CASHIER_WORKER_SALARY_TAG],
      }),
      getCashierWorkerSalaryHistory: builder.mutation({
        query: ({ workerId, start, end }) => ({
          url: CASHIER_API.WORKER_SALARY_HISTORY_GET({ workerId, start, end }),
          method: "GET",
        }),
        invalidatesTags: [CASHIER_WORKER_SALARY_TAG],
      }),
      addCashierWorkerSalary: builder.mutation({
        query: (body) => ({
          url: CASHIER_API.WORKER_SALARY_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [CASHIER_WORKER_SALARY_TAG],
      }),

      /* BUTCHER */
      getCashierButcher: builder.query({
        query: () => CASHIER_API.BUTCHER_GET,
        providesTags: [CASHIER_BUTCHER_SALARY_TAG],
      }),
      addCashierButcherSalary: builder.mutation({
        query: (body) => ({
          url: CASHIER_API.BUTCHER_SALARY_ADD,
          method: "POST",
          body,
        }),
        invalidatesTags: [CASHIER_BUTCHER_SALARY_TAG],
      }),
    }),
  });

export const {
  /* WORKER */
  useGetCashierWorkerQuery,
  useGetCashierWorkerSalaryHistoryMutation,
  useAddCashierWorkerSalaryMutation,
  /* BUTCHER */
  useGetCashierButcherQuery,
  useAddCashierButcherSalaryMutation,
} = cashierSalaryApiSlice;

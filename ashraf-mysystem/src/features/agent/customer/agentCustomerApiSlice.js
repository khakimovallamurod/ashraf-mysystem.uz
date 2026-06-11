import { AGENT_API } from "../../../app/api/api";
import { apiSlice } from "../../../app/api/apiSlice";

const AGENT_CUSTOMER_TAG = "SALES_CUSTOMER";

const agentCustomerApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: [AGENT_CUSTOMER_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAgentCustomer: builder.query({
        query: () => AGENT_API.CUSTOMER_GET,
        providesTags: [AGENT_CUSTOMER_TAG],
      }),
      getAgentCustomerCategory: builder.query({
        query: () => AGENT_API.CUSTOMER_CATEGORY_GET,
      }),
      addAgentCustomer: builder.mutation({
        query: (data) => ({
          url: AGENT_API.CUSTOMER_ADD,
          method: "POST",
          body: data,
        }),
        invalidatesTags: [AGENT_CUSTOMER_TAG],
      }),
    }),
  });

export const {
  useGetAgentCustomerQuery,
  useGetAgentCustomerCategoryQuery,
  useAddAgentCustomerMutation,
} = agentCustomerApiSlice;

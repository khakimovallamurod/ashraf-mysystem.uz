import { AGENT_API } from "../../app/api/api";
import { apiSlice } from "../../app/api/apiSlice";

const AGENT_TAG = "AGENT_API";


const agentApiSlice = apiSlice
.enhanceEndpoints({addTagTypes: [AGENT_TAG]})
.injectEndpoints({
  endpoints: (builder) => ({
    getAgentProducts: builder.query({
      query: () => AGENT_API.PRODUCT_GET,
    }),
    getAgentRegion: builder.query({
      query: () => AGENT_API.REGION_GET,
    }),
    getAgentDistrict: builder.mutation({
      query: (regionId) => ({
        url: AGENT_API.DISTRICT_GET(regionId),
        method: "GET",
      }),
    }),
    addAgentPlacingOrderToSales: builder.mutation({
      query: (body) => ({
        url: AGENT_API.PLACING_ORDER_TO_SALES,
        method: "POST",
        body,
      }),
      invalidatesTags: [AGENT_TAG],
    })
  })
})

export const {
  useGetAgentProductsQuery,
  useGetAgentRegionQuery,
  useGetAgentDistrictMutation,
  useAddAgentPlacingOrderToSalesMutation,
} = agentApiSlice
import {ADMIN_API} from "../../../app/api/api";
import {apiSlice} from "../../../app/api/apiSlice";

const ADMIN_REPORT_GRIND_TAG = "ADMIN_REPORT_GRIND";

export const adminReportGrindApiSlice = apiSlice
  .enhanceEndpoints({addTagTypes: [ADMIN_REPORT_GRIND_TAG]})
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminReportGrind: builder.query({
        query: ({start, end}) => ADMIN_API.REPORT_GRIND_GET_BY_DATE({start, end}),
        providesTags: [ADMIN_REPORT_GRIND_TAG],
      }),
    }),
  });

export const {useGetAdminReportGrindQuery} =
  adminReportGrindApiSlice;

import {ADMIN_API} from "../../../app/api/api";
import {apiSlice} from "../../../app/api/apiSlice";

const ADMIN_RESIDUE_TAG = "ADMIN_RESIDUE_TAG";

export const adminDepartmentApiSlice = apiSlice
  .enhanceEndpoints({addTagTypes: [ADMIN_RESIDUE_TAG]})
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminResidue: builder.query({
        query: () => ADMIN_API.RESIDUE_GET,
        providesTags: [ADMIN_RESIDUE_TAG],
      }),
      getAdminResidueMore: builder.query({
        query: ({polkaId, productId}) => ADMIN_API.RESIDUE_MORE_GET(polkaId, productId),
        providesTags: [ADMIN_RESIDUE_TAG],
      }),
    }),
  });

export const {useGetAdminResidueQuery, useGetAdminResidueMoreQuery} =
  adminDepartmentApiSlice;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderProductsListGrind: [],
};

export const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    addSalesOrderProductsListGrind: (state, action) => {
      if (
        !state.orderProductsListGrind.find(
          (item) => item.id === action.payload?.product?.id
        )
      ) {
        state.orderProductsListGrind.push({
          ...action.payload.product,
          mass: action.payload.mass,
        });
      }
    },
    deleteSalesOrderProductsListGrind: (state, action) => {
      state.orderProductsListGrind = state.orderProductsListGrind.filter(
        (item) => item.id !== action.payload
      );
    },
    clearSalesOrderProductsListGrind: (state) => {
      state.orderProductsListGrind = [];
    },
  },
});

export const {
  addSalesOrderProductsListGrind,
  clearSalesOrderProductsListGrind,
  deleteSalesOrderProductsListGrind,
} = salesSlice.actions;

export default salesSlice.reducer;

export const selectSalesOrderAllProductsGrind = (state) =>
  state.sales.orderProductsListGrind;

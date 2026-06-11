import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    items: []
}

export const breadcrumbSlice = createSlice({
    name: 'breadcrumb',
    initialState,
    reducers: {
        addBreadcrumb: (state, action) => {
            state.items = action.payload
        },
        clearBreadcrumb: state => {
            state.items = []
        }
    }
})

export const {addBreadcrumb, clearBreadcrumb} = breadcrumbSlice.actions;

export default breadcrumbSlice.reducer;

export const selectedBreadcrumb = (state)=>state.breadcrumb.items;
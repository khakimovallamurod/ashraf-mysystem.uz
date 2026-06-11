import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
};

export const themeModeSlice = createSlice({
    name: "themeMode",
    initialState,
    reducers: {
        changeMode: (state, action) => {
            if (action.payload === "light" || action.payload === "dark") {
                state.mode = action.payload;
            } else {
                state.mode = "light";
            }
        },
    },
});

export const { changeMode } = themeModeSlice.actions;

export default themeModeSlice.reducer;

export const selectedThemeMode = (state) => state.themeMode.mode;

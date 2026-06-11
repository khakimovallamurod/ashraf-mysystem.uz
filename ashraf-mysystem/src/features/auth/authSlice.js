import { createSlice } from "@reduxjs/toolkit";
import { ACCESS_TOKEN_NAME } from "../../util/const";

const initialState = {
    user: {},
    role: null,
    token: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken, role, remember } = action.payload;
            if (accessToken) {
                if (remember) {
                    localStorage.setItem(ACCESS_TOKEN_NAME, accessToken);
                }
                state.token = accessToken
            }

            if (user) state.user = user;
            if (role) state.role = role;
        },
        logOut: (state) => {
            state.user = null;
            state.role = null;
            state.accessToken = null;
            localStorage.removeItem(ACCESS_TOKEN_NAME);
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentRole = (state) => state.auth.role;
export const selectCurrentAccessToken = (state) => state.auth.token;

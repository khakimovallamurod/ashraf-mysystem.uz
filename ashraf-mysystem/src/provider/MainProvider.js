import React, { useState } from "react";
import AuthProvider from "./AuthProvider";
import Loading from "../components/common/loading/Loading";


function MainProvider({ children }) {
    const [loading, setLoading] = useState(true);

    return (
        <AuthProvider setLoading={setLoading}>
            {loading ? <Loading height="100vh" /> : children}
        </AuthProvider>
    );
}

export default MainProvider;

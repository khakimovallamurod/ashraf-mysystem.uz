import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGetUserDataMutation } from "../features/auth/authApiSlice";
import {
  logOut,
  selectCurrentAccessToken,
  setCredentials,
} from "../features/auth/authSlice";
import { ACCESS_TOKEN_NAME } from "../util/const";

function AuthProvider({ setLoading, children }) {
  /* Store */
  const token = useSelector(selectCurrentAccessToken);

  /* Dispatch */
  const dispatch = useDispatch();

  /* API */
  const [getUserData] = useGetUserDataMutation();

  /* Get Local token */
  useEffect(() => {
    if (!token) {
      const local_token = localStorage.getItem(ACCESS_TOKEN_NAME);
      if (local_token) dispatch(setCredentials({ accessToken: local_token }));
      else setLoading(false);
    }
  }, [dispatch, setLoading, token]);

  const handleGetUserData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUserData().unwrap();
      
      if (res.success === true) {
        /* Success */
        if (res.data) {
          const { data } = res;

          dispatch(
            setCredentials({
              user: {
                name: data?.ism,
                surname: data?.familya,
                email: data?.email,
                telefon: data?.telefon,
                image: data?.rasm,
                login: data?.login,
              },
              accessToken: data?.token,
              role: data?.rol,
            })
          );
        }
      } else if (res.success === false) {
        /* Token incorrect */
        toast.error("Noma'lum xatolik, qaytadan kiring!");
        dispatch(logOut());
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, getUserData, setLoading]);

  /* API */
  useEffect(() => {
    if (token) handleGetUserData();
  }, [handleGetUserData, token]);

  return <>{children}</>;
}

export default AuthProvider;

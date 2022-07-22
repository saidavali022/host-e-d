import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import axios, { toast } from "@utils/defaultImports";
const logout = () => {
  const globalState = useSelector((state) => state.globalState);
  const dispatch = useDispatch();
  const router = useRouter();

  const processLogoff = () => {
    if (globalState.role != "admin") {
      axios
        .put(`/attendance/${globalState.Employee_id}`)
        .then((res: any) => {
          dispatch({ type: "logout" });
          router.push("/");
        })
        .catch((error: any) => {
          console.info("Error - ", JSON.stringify(error.response.data));
          toast.error(error.response.data.message, {
            theme: "colored",
          });
          return;
        });
    }
    if (globalState.role == "admin") {
      dispatch({ type: "logout" });
      router.push("/");
    }
  };
  useEffect(() => {
    processLogoff();
  }, []);
  return <div>...redirecting</div>;
};

export default logout;

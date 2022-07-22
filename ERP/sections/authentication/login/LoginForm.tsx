import { useState } from "react";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import NextLink from "next/link";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// component
import Iconify from "@components/Iconify";
import { fontSize } from "@mui/system";

// ----------------------------------------------------------------------
export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setformData] = useState({});

  const getFormData = (event) => {
    setformData({ ...formData, [event.target.name]: event.target.value });
  };

  // dispatch({ payload: "data", type: "login" });

  const handleSubmit = () => {
    event.preventDefault();
    console.log(formData);
    axios({
      method: "POST",
      url: "/users/login",
      data: formData,
    })
      .then(function (response: any) {
        if (response.status === 200 && response.data.status === 200) {
          dispatch({ type: "login", payload: response.data });
          router.push("/" + response.data.role);
          toast.success("success", {
            theme: "colored",
          });
        } else {
          toast.error("Invalid Login Details", {
            theme: "colored",
          });
        }
      })
      .catch(function (error: any) {});
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          onChange={getFormData}
          fullWidth
          name="employee_id"
          autoComplete="username"
          label="Employee Id"
          required
        />
        <TextField
          fullWidth
          name="password"
          onChange={getFormData}
          autoComplete="current-password"
          type="password"
          label="Password"
          required
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 2 }}
      >
        <NextLink variant="subtitle2" href="#" underline="hover">
          Forgot password?
        </NextLink>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained">
        Login
      </LoadingButton>
      {ToastContainer_box}
    </form>
  );
}

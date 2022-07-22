import { useState, useEffect } from "react";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import UserDashboardLayout from "@layouts/userdashboard";
import NextLink from "next/link";

import {
  Container,
  Box,
  TextField,
  Stack,
  Card,
  Typography,
} from "@mui/material";
import styles from "@styles/Users.module.css";
import { useRouter } from "next/router";
function comadvsug() {
  const router = useRouter();
  const [leaveType, setLeaveType] = useState();
  const [page, setpage] = useState();
  const globalState = useSelector((state) => state.globalState);
  const [formData, setFormData] = useState({
    employee_id: globalState.Employee_id,
  });

  useEffect(() => {
    if (router.isReady) {
      setLeaveType(router.query.type);
    }
  }, [router.isReady, router.query.type]);

  const formSubmit = (event) => {
    event.preventDefault();
    axios({
      method: "post",
      url: `${"/lettergenaration/comadvsug"}`,
      data: formData,
    })
      .then(function (response) {
        event.target.reset();
        if (response.status === 200) {
          toast.success("success", {
            theme: "colored",
          });
        }
      })
      .catch(function (error) {
        toast.error("error");
      });
  };

  useEffect(() => {
    if (router.isReady) {
      setFormData({ ...formData, letter_type: leaveType });
    }
  }, [router.isReady, leaveType]);

  useEffect(() => {
    if (leaveType == "advices_suggestions") {
      setpage("Advices Suggestions");
    } else if (leaveType == "complaints") {
      setpage("Complaints");
    }
  }, [leaveType]);

  return (
    <Box>
      <Container>
        <Box
          m={1}
          //margin
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <NextLink href={"./comadvsuglist?type=" + leaveType}>
            <Button variant="contained" color="primary" sx={{ height: 40 }}>
              {page} List
            </Button>
          </NextLink>
        </Box>
        <Card style={{ padding: "0px 80px", paddingBottom: "200px" }}>
          <Typography
            style={{ textTransform: "capitalize" }}
            variant="h4"
            raised
            sx={{ py: 4 }}
          >
            {leaveType == "advices_suggestions" ? "Suggestions" : "Complaints "}
            Letter
          </Typography>
          <form onSubmit={() => formSubmit(event)}>
            <TextField
              required
              lable="Reason"
              name="message"
              className={styles.taskInputField}
              multiline="true"
              minRows="4"
              onChange={(event) => {
                setFormData({
                  ...formData,
                  [event?.target.name]: event?.target.value,
                });
              }}
            />

            <Stack
              direction="row"
              justifyContent="flex-end"
              sx={{ pr: 5, mr: 2 }}
              alignItems="center"
              spacing={2}
            >
              {(leaveType == "complaints" ||
                leaveType == "advices_suggestions") && (
                <Button type="submit" variant="contained">
                  Submit
                </Button>
              )}
            </Stack>
          </form>
        </Card>
      </Container>
      {ToastContainer_box}
    </Box>
  );
}
export default comadvsug;
// comadvsug.getLayout = (page) => (
//   <UserDashboardLayout>{page}</UserDashboardLayout>
// );

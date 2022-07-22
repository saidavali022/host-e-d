import { useState, useEffect, useMemo } from "react";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import UserDashboardLayout from "@layouts/userdashboard";
import styles from "@styles/Users.module.css";
import Page from "@components/Page";
import {
  Container,
  Box,
  TextField,
  Stack,
  Card,
  Typography,
  Button,
  Drawer,
} from "@mui/material";

import Leavelist from "pages/components/letter_generation/LeaveList";
import { useRouter } from "next/router";
const leaves = () => {
  const router = useRouter();
  const globalState = useSelector((state) => state.globalState);
  const [rowData, setrowData] = useState([]);
  const [leaveType, setLeaveType] = useState();
  const [page, setpage] = useState();
  useEffect(() => {
    if (router.isReady) {
      setLeaveType(router.query.type);
    }
  }, [router.isReady, router.query.type]);

  const getLeavesData = () => {
    axios({
      method: "get",
      url: `${"lettergenaration/user/" + globalState.Employee_id}`,
      responseType: "stream",
    }).then(function (response) {
      setrowData(response.data);
    });
  };

  const [filterData, setFilterData] = useState([]);
  useEffect(() => {
    if (router.isReady) {
      var Data = rowData.filter(
        (rowData) => rowData.permission_type == leaveType
      );
      setFilterData(Data);
    }
  }, [leaveType, rowData]);

  // useEffect(() => {
  //   getLeavesData();
  // }, []);

  useEffect(() => {
    getLeavesData();
    if (leaveType == "earlylogout") {
      setpage("early logout");
    } else if (leaveType == "latelogin") {
      setpage("late login");
    } else {
      setpage(leaveType);
    }
  }, [leaveType]);
  return (
    <Page title="E&D Leave">
      <Container>
        <Typography variant="h4" sx={{ my: 3, textTransform: "capitalize" }}>
          View List of {page} Request
        </Typography>
        <Card
          sx={{
            height: 650,
            width: "100%",
          }}
        >
          <Leavelist data={filterData} role={"user"} />
        </Card>
        {ToastContainer_box}
      </Container>
    </Page>
  );
};

export default leaves;
// leaves.getLayout = (page) => <UserDashboardLayout>{page}</UserDashboardLayout>;

import { useState, useEffect, useMemo } from "react";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import DashboardLayout from "@layouts/hrdashboard";
import styles from "@styles/Users.module.css";
import Page from "@components/Page";
import { useRef } from "react";
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

import Letterlist from "pages/components/letter_generation/Letterlist";
import { useRouter } from "next/router";
const list = () => {
  const router = useRouter();
  const [rowData, setrowData] = useState([]);
  const [leaveType, setLeaveType] = useState();
  useEffect(() => {
    if (router.isReady) {
      setLeaveType(router.query.type);
    }
  }, [router.isReady, router.query.type]);

  const getLeavesData = () => {
    axios({
      method: "get",
      url: `${"lettergenaration/letters"}`,
      responseType: "stream",
    }).then(function (response) {
      setrowData(response.data);
    });
  };

  const [filterData, setFilterData] = useState([]);
  useEffect(() => {
    if (router.isReady) {
      var Data = rowData.filter((rowData) => rowData.letter_type == leaveType);
      setFilterData(Data);
    }
  }, [leaveType, rowData]);

  useEffect(() => {
    getLeavesData();
  }, [leaveType]);
  return (
    <Page title="E&D Leave List">
      <Card
        sx={{
          height: 800,
          width: "100%",
        }}
      >
        <Typography variant="h4" sx={{ my: 3, textTransform: "capitalize" }}>
          View List of {leaveType}
        </Typography>
        <Letterlist data={filterData} role={"admin"} />
      </Card>
    </Page>
  );
};

export default list;
// list.getLayout = (page: String) => <DashboardLayout>{page}</DashboardLayout>;

import { useState, useEffect, useMemo } from "react";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import DashboardLayout from "@layouts/dashboard";
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

import Comadvsuglistdata from "../../components/letter_generation/Comadvsuglist";
import { useRouter } from "next/router";
const comadvsuglist = () => {
  const router = useRouter();
  const globalState = useSelector((state) => state.globalState);
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
      url: `${"lettergenaration/comadvsug/"}`,
      responseType: "stream",
    }).then(function (response) {
      setrowData(response.data);
      // console.log(response);
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
  }, []);
  return (
    <Page title="E&D Leave">
      <Typography variant="h4" sx={{ my: 3 }}>
        View List of{" "}
        {leaveType == "advices_suggestions" ? "Suggestions" : "complaints"}{" "}
        Request
      </Typography>
      <Card
        sx={{
          height: 650,
          width: "100%",
        }}
      >
        <Comadvsuglistdata data={filterData} />
      </Card>
      {ToastContainer_box}
    </Page>
  );
};

export default comadvsuglist;
// comadvsuglist.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

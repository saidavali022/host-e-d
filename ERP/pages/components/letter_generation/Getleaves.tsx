import { useState, useEffect, useMemo } from "react";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import { io } from "socket.io-client";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import DashboardLayout from "@layouts/dashboard";
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

import Leavelist from "pages/components/letter_generation/LeaveList";
import { useRouter } from "next/router";
const Getleaves = (props) => {
  const socket = io("http://192.168.1.187:3001/");
  const childCompRef = useRef();
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

  const updateStatus = async (data) => {
    await axios({
      method: "put",
      url: `${"/lettergenaration/" + data.id}`,
      data: {
        [data.field]: data.status,
      },
    })
      .then((response: any) => {
        if (response.status == 200) {
          toast.success("success", {
            theme: "colored",
          });
          getLeavesData();
          childCompRef.current.passToChild();

          const details = {
            employee_id: data.employee_id,
            type: "leave",
            message: `${" Your " + page + " Is " + data.status}`,
          };
          socket.emit("sendNotification", details);
        }
      })
      .catch(function (error: any) {});
  };

  const getLeavesData = () => {
    axios({
      method: "get",
      url: `${"lettergenaration/" + props.role}`,
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
    <>
      <Typography variant="h4" sx={{ my: 3, textTransform: "uppercase" }}>
        {page} Requests
      </Typography>
      <Leavelist
        data={filterData}
        passToParaent={updateStatus}
        ref={childCompRef}
        role={"admin"}
      />
    </>
  );
};

export default Getleaves;
// Getleaves.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

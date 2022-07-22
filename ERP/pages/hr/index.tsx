// material
import {
  Box,
  Grid,
  Container,
  Typography,
  Card,
  Stack,
  Chip,
} from "@mui/material";
// components
import Page from "@components/Page";
import NextHead from "next/head";
import { useState, useEffect, useMemo } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import { useSelector } from "react-redux";
import AttendanceStatus from "@sections/dashboard/user/AttendanceStatus";
import UsersAvailableList from "@sections/dashboard/user/UsersAvailableList";
import moment from "moment";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridCallbackDetails,
  GridRenderCellParams,
  GridRowParams,
  GridToolbar,
} from "@mui/x-data-grid";

import { leaveColorChip } from "@utils/chipsColor";
import { useRouter } from "next/router";
// ----------------------------------------------------------------------

export default function DashboardApp() {
  const router = useRouter();
  const globalState = useSelector((state) => state.globalState);
  interface Types {
    on_board_users: string;
    hr_letter_request: string;
    hr_letter_request_list: object;
    available_users: object;
  }

  const [dashBoard, setdashBoard] = useState<Types>([]);
  const getDashBoardData = () => {
    axios({
      method: "get",
      url: "/dashboard/hr/",
    })
      .then(function (response: any) {
        if (response.status === 200) {
          setdashBoard(response.data);
        }
      })
      .catch(function (error: any) {});
  };

  useMemo(() => {
    getDashBoardData();
  }, []);

  const style = {
    width: "300px",
    height: "140px",
    backgroundColor: "#BDEFAD",
    display: "inline-block",
    margin: "15px",
    boxShadow: 3,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  };
  ChartJS.register(...registerables);

  const columns: GridColDef[] = [
    { field: "id", headerName: "S.No", width: 100, hide: true },
    { field: "employee_id", headerName: "Employee ID", width: 250 },
    {
      field: "username",
      headerName: "User Name",
      width: 250,
      renderCell: (params: GridRenderCellParams) => {
        return params.row.employee.username;
      },
    },
    {
      field: "created_at",
      headerName: "Applied On",
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        return moment(params.row.created_at).utc().format("DD-MMM-YYYY");
      },
    },

    {
      field: "permission_type",
      headerName: "Type",
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <p>
            {params.row.permission_type == "latelogin"
              ? "Late Login"
              : params.row.permission_type == "earlylogout"
              ? "Early Logout"
              : "Leave"}
          </p>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      type: "actions",
      width: 220,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Chip
            sx={{ color: "#fff", textTransform: "capitalize" }}
            label={params.row.leave_status}
            color={leaveColorChip(params.row.leave_status)}
          />
        );
      },
    },
    { field: "leave_dates", headerName: "Dates", width: 250 },
  ];
  // <Chip label="primary" color="primary" variant="outlined" />

  // const data = {
  //   labels: ["Completed", "Pending"],
  //   datasets: [
  //     {
  //       data: [dashBoard.completed_task, dashBoard.pending_task],
  //       backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
  //     },
  //   ],
  // };

  const rowDoubleClick = (
    params: GridRowParams,
    event: MuiEvent<MouseEvent>,
    details: GridCallbackDetails
  ) => {
    event.preventDefault();
    router.push(
      "./hr/lettergereration/leaves?type=" +
        params.row.permission_type +
        "&id=" +
        params.row.id
    );
  };

  return (
    <>
      <NextHead>
        <title>Dashboard</title>
      </NextHead>
      <Box>
        <Container maxWidth={false}>
          <Box sx={{ pb: 2 }}>
            <Typography variant="h4" sx={{ textTransform: "capitalize" }}>
              Welcome back! {globalState?.firstName} {globalState?.lastName}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <AttendanceStatus />
            </Stack>
          </Box>
          <Grid container spacing={3}>
            <Grid item>
              <Card sx={style}>
                <div className="center-container">
                  <Typography variant="h4">
                    Available Employees <br></br>{" "}
                    {dashBoard.available_users?.users.length}
                  </Typography>
                </div>
              </Card>
            </Grid>
            <Grid item>
              <Card sx={style}>
                <div className="center-container">
                  <Typography variant="h4">
                    Letter Request <br></br> {dashBoard.hr_letter_request}
                  </Typography>
                </div>
              </Card>
            </Grid>
            <Grid item>
              <Card sx={style}>
                <div className="center-container">
                  <Typography variant="h4">
                    OnBoarding Request <br></br> {dashBoard.on_board_users}
                  </Typography>
                </div>
              </Card>
            </Grid>
          </Grid>
          <Box>
            <Typography sx={{ my: 3 }} variant="h4">
              Recent Letter Request
            </Typography>
          </Box>
          <Box style={{ height: 350 }}>
            <DataGrid
              rows={dashBoard.hr_letter_request_list}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              components={{
                Toolbar: GridToolbar,
              }}
              onRowDoubleClick={rowDoubleClick}
            />
          </Box>
          <UsersAvailableList users={dashBoard.available_users?.users} />
          {/* <div
            style={{
              margin: "50px 0px",
              display: "block",
              width: "400px",
            }}
          >
            <Typography sx={{ textAlign: "center", my: 3 }} variant="h4">
              Recent Letter Request
            </Typography>
            <Pie data={data} />
          </div> */}
        </Container>
      </Box>
    </>
  );
}
// DashboardApp.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

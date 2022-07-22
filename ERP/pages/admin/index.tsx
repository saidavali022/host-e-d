// material
import {
  Box,
  Grid,
  Container,
  Typography,
  Card,
  Stack,
  Chip,
  Button,
} from "@mui/material";
// components
import Page from "@components/Page";
import { io } from "socket.io-client";
import NextHead from "next/head";
import { useState, useEffect, useMemo } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { useRouter } from "next/router";
import UsersAvailableList from "@sections/dashboard/user/UsersAvailableList";
// ----------------------------------------------------------------------

export default function DashboardApp() {
  const socket = io("http://localhost:3001/");

  const router = useRouter();
  const globalState = useSelector((state) => state.globalState);
  interface Types {
    admin_letter_request: string;
    pending_task: string;
    completed_task: string;
    on_going_task_list: object;
    available_users: object;
  }
  const [dashBoard, setdashBoard] = useState<Types>([]);
  const getDashBoardData = () => {
    axios
      .get("/dashboard/admin/")
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
    { field: "title", headerName: "Title", width: 250 },
    { field: "team", headerName: "Team", width: 250 },
    {
      field: "priority",
      headerName: "priority",
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Chip
            label={params.row.priority}
            sx={{ color: "white" }}
            color={priorityColor(params)}
          />
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Chip
            label={params.row.status}
            sx={{ color: "white" }}
            color={chipColor(params)}
          />
        );
      },
    },
  ];

  const chipColor = (params: any) => {
    if (params.row.status === "completed") return "success";
    if (params.row.status === "pending") {
      return "warning";
    }
  };

  const priorityColor = (params: any) => {
    if (params.row.priority === "high") return "error";
    if (params.row.priority === "low") {
      return "primary";
    }
  };

  const data = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [dashBoard.completed_task, dashBoard.pending_task],
        backgroundColor: ["#00AB55", "#FFC107"],
      },
    ],
  };

  const rowDoubleClick = (
    params: GridRowParams,
    event: MuiEvent<MouseEvent>,
    details: GridCallbackDetails
  ) => {
    event.preventDefault();
    router.push("./admin/tasks");
  };

  return (
    <>
      <NextHead>
        <title>Dashboard</title>
      </NextHead>
      <Box>
        <Container>
          <Box sx={{ pb: 5 }}>
            <Typography variant="h4" sx={{ textTransform: "capitalize" }}>
              Welcome back! {globalState?.firstName} {globalState?.lastName}
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <div
              style={{
                width: "100%",
              }}
            >
              <Card sx={style}>
                <div className="center-container">
                  <Typography variant="h4">
                    Available Employees <br></br>{" "}
                    {dashBoard.available_users?.users.length}
                  </Typography>
                </div>
              </Card>

              <Card sx={style}>
                <div className="center-container">
                  <Typography variant="h4">
                    Letter Request <br></br> {dashBoard.admin_letter_request}
                  </Typography>
                </div>
              </Card>
            </div>
            <div style={{ display: "grid" }}>
              <Box>
                <Typography sx={{ textAlign: "center", my: 3 }} variant="h4">
                  Recent Task
                </Typography>
              </Box>
            </div>
            <br></br>
          </Grid>
          <Box style={{ height: 350, textTransform: "capitalize" }}>
            <DataGrid
              rows={dashBoard.on_going_task_list}
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
          <div
            style={{
              margin: "50px 0px",
              display: "block",
              width: "400px",
            }}
          >
            <Typography sx={{ textAlign: "center", my: 3 }} variant="h4">
              Task Chart
            </Typography>
            <Pie data={data} />
          </div>
        </Container>
      </Box>
    </>
  );
}
// DashboardApp.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

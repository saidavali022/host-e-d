// material
import {
  Box,
  Grid,
  Container,
  Typography,
  Card,
  Stack,
  Chip,
  Avatar,
} from "@mui/material";
// components
import Page from "@components/Page";
import NextHead from "next/head";
import { useState, useEffect, useMemo } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import { useSelector } from "react-redux";
import moment from "moment";
import AttendanceStatus from "@sections/dashboard/user/AttendanceStatus";
import { fDate } from "@utils/formatTime";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { leaveColorChip } from "@utils/chipsColor";

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const globalState = useSelector((state) => state.globalState);
  interface Types {
    leave_request: string;
    pending_task: string;
    completed_task: string;
    on_going_task_list: object;
    on_going__leave_request_list: object;
  }
  const [dashBoard, setdashBoard] = useState<Types>([]);
  const getDashBoardData = () => {
    axios({
      method: "get",
      url: "/dashboard/user/" + globalState.Employee_id,
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
    {
      field: "creator",
      headerName: "Created By",
      width: 250,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <Avatar
              alt={params.row.creator?.username}
              src={
                process.env.NEXT_PUBLIC_HOST +
                "/" +
                params.row.creator?.passportSizePhoto
              }
            />
            <Typography variant="subtitle1">
              {params.row.creator.username}
            </Typography>
          </>
        );
      },
    },
    {
      field: "created_at",
      headerName: "Assign Date",
      width: 100,
      renderCell: (params: GridRenderCellParams) =>
        fDate(params.row.created_at),
    },
    {
      field: "start_date",
      headerName: "Start Date",
      width: 100,
      renderCell: (params: GridRenderCellParams) =>
        fDate(params.row.start_date),
    },
    {
      field: "end_date",
      headerName: "End Date",
      width: 100,
      renderCell: (params: GridRenderCellParams) => fDate(params.row.end_date),
    },
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
    { field: "title", headerName: "Title", width: 250 },
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

  const leave_columns: GridColDef[] = [
    { field: "id", headerName: "S.No", width: 100, hide: true },
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
    ,
    { field: "leave_dates", headerName: "Dates", width: 250 },
    {
      field: "action",
      headerName: "Status",
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
  ];

  const data = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [dashBoard.completed_task, dashBoard.pending_task],
        backgroundColor: ["#00AB55", "#FFC107"],
      },
    ],
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

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={5}
            >
              <AttendanceStatus />
            </Stack>
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
                    Points <br></br> xxx
                  </Typography>
                </div>
              </Card>

              <Card sx={style}>
                <div className="center-container">
                  <Typography variant="h4">
                    Letter Request <br></br> {dashBoard.leave_request}
                  </Typography>
                </div>
              </Card>
            </div>
          </Grid>
          <Box style={{ height: 350, textTransform: "capitalize" }}>
            <Typography sx={{ my: 3 }} variant="h4">
              Recent Task
            </Typography>
            <DataGrid
              rows={dashBoard.on_going_task_list}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </Box>

          <Box style={{ height: 350 }}>
            <Typography sx={{ my: 3 }} variant="h4">
              Recent Letter Request
            </Typography>
            <DataGrid
              rows={dashBoard.on_going__leave_request_list}
              columns={leave_columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </Box>
          <Box sx={{ margin: "50px 0" }}>
            <Typography sx={{ textAlign: "center", my: 3 }} variant="h4">
              Task Chart
            </Typography>
            <Pie data={data} />
          </Box>
        </Container>
      </Box>
    </>
  );
}

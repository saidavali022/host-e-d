import { useState, useEffect, useMemo } from "react";
import UserDashboardLayout from "@layouts/userdashboard";
import NextLink from "next/link";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { NextPage } from "next";
import { io } from "socket.io-client";
// import { loadEnvConfig } from "@next/env";

// material
import {
  Card,
  Stack,
  Container,
  Typography,
  Button,
  Breadcrumbs,
  Box,
  TextField,
  MenuItem,
  Chip,
  Avatar,
} from "@mui/material";
// components
import Page from "@components/Page";
import { fDate } from "@utils/formatTime";
import styles from "@styles/Users.module.css";
import Drawer from "@mui/material/Drawer";
import moment from "moment";
import clsx from "clsx";
import {
  GridColumns,
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import Label from "@components/Label";
import { colorStatusPriority } from "@utils/chipsColor";

function Tasks(props: any) {
  const socket = io("http://192.168.1.187:3001/");
  const [rowData, setrowData] = useState([]);
  const [formData, setformData] = useState();
  const [editId, setEditId] = useState();
  const [anchor, setanchor] = useState(false);
  const globalState = useSelector((state) => state.globalState);

  const [selectId, setselectId] = useState(0);
  const columns: GridColDef[] = [
    { field: "id", headerName: "S.No", width: 100, hide: true },
    { field: "title", headerName: "Title", width: 250 },
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
      field: "start_date",
      headerName: "Start Date",
      width: 250,
      renderCell: (params: GridRenderCellParams) =>
        moment(params.row.start_date).utc().format("DD-MM-YYYY : HH:mm A"),
    },
    {
      field: "end_date",
      headerName: "End Date",
      width: 250,
      renderCell: (params: GridRenderCellParams) =>
        moment(params.row.end_date).utc().format("DD-MM-YYYY : HH:mm A"),
    },
    {
      field: "created_at",
      headerName: "created At",
      width: 250,
      renderCell: (params: GridRenderCellParams) =>
        moment(params.row.created_at).utc().format("DD-MM-YYYY : HH:mm A"),
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
      field: "action",
      headerName: "Action",
      type: "actions",
      width: 220,
      renderCell: renderAction,
    },
  ];

  const priorityColor = (params: any) => {
    if (params.row.priority === "high") return "error";
    if (params.row.priority === "low") {
      return "primary";
    }
  };

  const getTaskList = () => {
    axios({
      method: "get",
      url: `${"/tasks/" + globalState.Employee_id + "/"}`,
    })
      .then(function (response: any) {
        if (response.status === 200) {
          setrowData(response.data.data);
        }
      })
      .catch(function (error: any) {});
  };

  useEffect(() => {
    getTaskList();
  }, []);

  useMemo(() => {
    const editDate = rowData.filter(
      (rowData: any) => rowData.id == editId || 0
    );
    if (editDate[0]) setformData(editDate[0]);
  }, [editId]);

  const updateData = async (event: Event) => {
    await axios({
      method: "put",
      url: `${"/tasks/status/" + event.target.id}`,
      data: {
        status: "completed",
      },
    })
      .then((response: any) => {
        if (response.status == 200) {
          toast.success("success", {
            theme: "colored",
          });
          getTaskList();
          const details = {
            type: "task",
            message: `${globalState.user_name + " Has Completed The Task"}`,
          };
          socket.emit("sendNotification", details);
        }
      })
      .catch(function (error: any) {});
  };

  function renderAction(params: GridRenderCellParams) {
    if (params.row.status === "completed") {
      return (
        <Stack direction="row" spacing={2}>
          <Button
            size="humongous"
            variant="contained"
            color="secondary"
            id={params.id}
            onClick={() => {
              setanchor(true);
              setEditId(params.id);
            }}
          >
            View
          </Button>

          <Button
            size="humongous"
            variant="contained"
            color="secondary"
            id={params.id}
            disabled={true}
          >
            Completed
          </Button>
        </Stack>
      );
    }
    return (
      <Stack direction="row" spacing={2}>
        <Button
          size="humongous"
          variant="contained"
          color="secondary"
          id={params.id}
          onClick={() => {
            setanchor(true);
            setEditId(params.id);
          }}
        >
          View
        </Button>
        <Button
          size="humongous"
          variant="contained"
          color="secondary"
          id={params.id}
          onClick={() => {
            updateData(event);
          }}
        >
          Complete
        </Button>
      </Stack>
    );
  }

  //   const [page, setPage] = useState(0);
  //   const [order, setOrder] = useState("asc");
  //   const [selected, setSelected] = useState([]);
  //   const [orderBy, setOrderBy] = useState("date");
  //   const [filterName, setFilterName] = useState("");
  //   const [rowsPerPage, setRowsPerPage] = useState(5);

  return (
    <Page title="Tasks | E & D 360">
      <Container>
        <Stack
          direction="column"
          alignItems="start"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Tasks
          </Typography>
          <Breadcrumbs aria-label="breadcrumb">
            <NextLink href="/user">Dashboard</NextLink>
            <Typography color="text.primary">Tasks</Typography>
          </Breadcrumbs>
        </Stack>
        <Card
          sx={{
            height: "500px",
            width: 1,
            textTransform: "capitalize",
          }}
        >
          <DataGrid
            rows={rowData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Card>
        <Drawer anchor="right" open={anchor} onClose={() => setanchor(false)}>
          <Box sx={{ width: 450 }}>
            <Container>
              <form>
                <Typography variant="h4" sx={{ mt: 4 }}>
                  Add Task
                </Typography>

                <TextField name="id" type="hidden" value={formData?.id} />
                <TextField
                  name="attachment"
                  type="hidden"
                  value={formData?.attachment}
                />

                <TextField
                  required
                  label="Title"
                  name="title"
                  className={styles.taskInputField}
                  value={formData?.title}
                />
                <TextField
                  required
                  label="Description"
                  name="description"
                  className={styles.taskInputField}
                  multiline
                  rows={3}
                  value={formData?.description}
                />

                {formData?.attachment && (
                  <NextLink
                    href={
                      process.env.NEXT_PUBLIC_HOST + "/" + formData?.attachment
                    }
                  >
                    <a
                      target="_blank"
                      style={{
                        color: "green",
                        fontWeight: "bold",
                        padding: "5px",
                      }}
                    >
                      View Attachment{" "}
                    </a>
                  </NextLink>
                )}

                <TextField
                  required
                  label="Select Team"
                  name="team"
                  className={styles.taskInputField}
                  value={formData?.team}
                />

                <TextField
                  required
                  label="Priority"
                  name="priority"
                  className={styles.taskInputField}
                  value={formData?.priority}
                />

                <TextField
                  required
                  label="Select Employee"
                  name="employee_id"
                  className={styles.taskInputField}
                  value={formData?.employee_id}
                />
                <TextField
                  required
                  label="Start Date"
                  name="start_date"
                  className={styles.taskInputField}
                  value={moment(formData?.start_date)
                    .utc()
                    .format("DD-MM-YYYY : HH:mm A")}
                />

                <TextField
                  required
                  label="End Date"
                  name="end_date"
                  className={styles.taskInputField}
                  value={moment(formData?.end_date)
                    .utc()
                    .format("DD-MM-YYYY : HH:mm A")}
                />
              </form>
            </Container>
          </Box>
        </Drawer>
      </Container>
    </Page>
  );
}

// Tasks.getLayout = (page) => {
//   return <UserDashboardLayout>{page}</UserDashboardLayout>;
// };

export default Tasks;

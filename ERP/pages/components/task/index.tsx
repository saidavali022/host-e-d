import { useEffect, useState } from "react";
import styles from "@styles/Users.module.css";
import Drawer from "@mui/material/Drawer";
import Iconify from "@components/Iconify";
import { useSelector, useDispatch } from "react-redux";
import DashboardLayout from "@layouts/dashboard";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// material
import {
  Stack,
  Button,
  Container,
  Typography,
  Breadcrumbs,
  Box,
  TextField,
  MenuItem,
  Menu,
  Chip,
  Avatar,
  Tooltip,
} from "@mui/material";
// components
import Page from "@components/Page";
import { useMemo } from "react";
import NextLink from "next/link";
import { fDate } from "@utils/formatTime";
//-----------------------
import { io } from "socket.io-client";

export default function Task() {
  const socket = io("http://192.168.1.187:3001/");
  const globalState = useSelector((state) => state.globalState);
  const router = useRouter();
  const [editId, setEditId] = useState();
  const [rowData, setRows] = useState([]);
  const [anchor, setanchor] = useState(false);
  const [InputDate, setInputDate] = useState("text");
  const [optionEmp, setoptionEmp] = useState("");
  const [priorityTeam, setpriorityTeam] = useState("");
  const [departments, setdepartments] = useState();

  const [designationData, setDesignationData] = useState([]);

  const [username, setusername] = useState();

  const [userData, setUserData] = useState([]);

  const [id, setId] = useState();

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
      setEditId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const changeoptionEmp = (event: any) => {
    setoptionEmp(event.target.value);
  };

  const handlePriorityChange = (event: any) => {
    setpriorityTeam(event.target.value);
    getFormData(event);
  };

  const [optionTeam, setoptionTeam] = useState("");
  const handleDepartmentChange = (event: any) => {
    setoptionTeam(event.target.value);
    designation(event.target.value);
  };

  const [formData, setformData] = useState<any>();

  const getFormData = (event: any) => {
    // setformData({ ...formData, [event.target.name]: event.target.value });
    if (event.target.name == "file") {
      setformData({
        ...formData,
        [event.target.name]: event.target.files[0],
      });
    } else {
      setformData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  const startDate = (newValue: Date | null) => {
    setformData({ ...formData, start_date: newValue });
  };

  const endDate = (newValue: Date | null) => {
    setformData({ ...formData, end_date: newValue });
  };

  const designation = (value) => {
    const Data = userData.filter((item, index) => item.department == value);
    // console.log(Data);
    setDesignationData(Data);
  };

  const submitFormData = (event: any) => {
    event.preventDefault();
    const formBindData = new FormData();
    formBindData.append("title", formData.title);
    formBindData.append("created_by", globalState?.Employee_id);
    formBindData.append("description", formData.description);
    formBindData.append("file", formData.file);
    formBindData.append("attachment", formData.attachment);
    formBindData.append("team", formData.team);
    formBindData.append("priority", formData.priority);
    formBindData.append("employee_id", formData.employee_id);
    formBindData.append("start_date", formData.start_date || new Date());
    formBindData.append("end_date", formData.end_date || new Date());
    const id = formData.id || 0;
    axios({
      method: "post",
      url: `${"/tasks/" + id}`,
      data: formBindData,
    })
      .then(function (response: any) {
        event.target.reset();
        if (response.status === 200) {
          getTasklist();
          toast.success("success", {
            theme: "colored",
          });

          const details = {
            employee_id: formData.employee_id,
            type: "task",
            message: "New Task Assigned",
          };
          socket.emit("sendNotification", details);
        }
      })
      .catch(function (error: any) {
        toast.error("error");
      });
  };

  const getTasklist = () => {
    axios({
      method: "get",
      url: "/tasks",
    })
      .then(function (response: any) {
        console.log(response);
        if (response.status === 200) {
          setRows(response.data.data);
        }
      })
      .catch(function (error: any) {});
  };

  const getAllUsersData = () => {
    axios({
      method: "get",
      url: "/users/info/",
    })
      .then(function (response: any) {
        if (response.status === 200) {
          setUserData(response.data);
        }
      })
      .catch(function (error: any) {});
  };

  useEffect(() => {
    getTasklist();
    getAllUsersData();
    // getDepartments();
  }, []);

  const departmentsData = userData.filter(
    (thing, index, self) =>
      index === self.findIndex((t) => t.department === thing.department)
  );

  // console.log(departmentsData);

  const deleteTask = (event: Event) => {
    axios({
      method: "delete",
      url: `${"/tasks/" + event.target.id}`,
    }).then(function (response: any) {
      if (response.status === 200) {
        getTasklist();
        toast.success("success", {
          theme: "colored",
        });
      }
    });
  };

  const getUsername = (value) => {
    const Data = userData.filter((item, index) => item.employee_id == value);
    if (Data[0]) {
      setusername(Data[0]?.username);
    }

    // console.log(value);
  };

  useMemo(() => {
    const editDate = rowData.filter(
      (rowData: any) => rowData.id == editId || 0
    );
    if (editDate[0]) {
      setformData(editDate[0]);
      designation(editDate[0]?.team);
      getUsername(editDate[0]?.employee_id);
      // console.log(editDate[0]?.employee_id);
    }
  }, [editId]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "S.No", width: 100, hide: true },
    { field: "team", headerName: "Team", width: 250 },
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
              sx={{ mx: 1 }}
            />
            <Typography variant="subtitle1">
              {params.row.creator.username}
            </Typography>
          </>
        );
      },
    },
    {
      field: "employee",
      headerName: "Employee Name",
      width: 250,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <Tooltip
              title={params.row.employee.username}
              placement="right-start"
            >
              <>
                <Avatar
                  alt={params.row.employee.username}
                  src={
                    process.env.NEXT_PUBLIC_HOST +
                    "/" +
                    params.row.employee.passportSizePhoto
                  }
                  sx={{ mx: 1 }}
                />
                <Typography variant="subtitle1">
                  {params.row.employee.username}
                </Typography>
              </>
            </Tooltip>
          </>
        );
      },
    },
    { field: "employee_id", headerName: "Employee ID", width: 200 },
    { field: "priority", headerName: "priority", width: 100 },
    { field: "title", headerName: "Title", width: 250 },

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
      field: "action",
      headerName: "Action",
      type: "actions",
      width: 220,
      renderCell: renderAction,
    },
  ];

  const chipColor = (params: any) => {
    if (params.row.status === "completed") return "success";
    if (params.row.status === "pending") {
      return "warning";
    }
  };

  function renderAction(params: GridRenderCellParams) {
    return (
      <Stack direction="row" spacing={2}>
        {params?.row.status == "pending" ? (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="error"
              id={params.id}
              onClick={deleteTask}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
            <Button
              size="humongous"
              variant="contained"
              color="success"
              id={params.id}
              onClick={() => {
                setanchor(true);
                setEditId(params.id);
              }}
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
          </Stack>
        ) : (
          <Button variant="contained" color="info">
            Completed
          </Button>
        )}
      </Stack>
    );
  }

  return (
    <Page title="User | E&amp;D 360">
      <Container maxWidth={false} sx={{ textTransform: "capitalize" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
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
              <NextLink color="inherit" href="/admin">
                Dashboard
              </NextLink>
              <Typography color="text.primary">Tasks</Typography>
            </Breadcrumbs>
          </Stack>

          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              setanchor(true);
              setformData();
              setEditId("");
              setusername();
            }}
          >
            Add Task
          </Button>
        </Stack>

        <DataGrid
          rows={rowData}
          columns={columns}
          pageSize={10}
          autoHeight={true}
          rowsPerPageOptions={[10]}
          components={{
            Toolbar: GridToolbar,
          }}
        />

        <Drawer anchor="right" open={anchor} onClose={() => setanchor(false)}>
          <Box sx={{ width: 450 }}>
            <Container>
              <form onSubmit={submitFormData}>
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
                  onChange={getFormData}
                  value={formData?.title}
                />
                <TextField
                  required
                  label="Priority"
                  name="priority"
                  className={styles.taskInputField}
                  value={formData?.priority}
                  select
                  onChange={handlePriorityChange}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </TextField>
                <TextField
                  required
                  label="Description"
                  name="description"
                  className={styles.taskInputField}
                  multiline
                  rows={3}
                  value={formData?.description}
                  onChange={getFormData}
                />
                <TextField
                  type="file"
                  className={styles.taskInputField}
                  onChange={getFormData}
                  name="file"
                />
                <TextField
                  required
                  label="Select Team"
                  name="team"
                  className={styles.taskInputField}
                  select
                  onChange={(event) => {
                    getFormData(event);
                    handleDepartmentChange(event);
                  }}
                  sx={{ textTransform: "capitalize" }}
                  value={formData?.team}
                >
                  {departmentsData.map((item, index) => {
                    return (
                      <MenuItem
                        value={departmentsData[index].department}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {departmentsData[index].department}
                      </MenuItem>
                    );
                  })}
                </TextField>
                <TextField
                  required
                  label="Select Employee"
                  name="employee_id"
                  className={styles.taskInputField}
                  select
                  onChange={(event) => {
                    getFormData(event);
                    changeoptionEmp(event);
                  }}
                  value={formData?.employee_id}
                >
                  {/* <MenuItem value={formData?.username}>
                  {formData?.username}
                </MenuItem> */}

                  {designationData.map((ite, index) => {
                    console.info(
                      "employees",
                      designationData[index].employee_id
                    );
                    return (
                      <MenuItem
                        value={designationData[index].employee_id}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {designationData[index].username}
                      </MenuItem>
                    );
                  })}
                </TextField>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label="Start Date"
                    inputFormat="dd/MM/yyyy"
                    value={formData?.start_date}
                    onChange={startDate}
                    renderInput={(params) => (
                      <TextField
                        className={styles.taskInputField}
                        {...params}
                      />
                    )}
                  />

                  <DesktopDatePicker
                    label="End Date"
                    inputFormat="dd/MM/yyyy"
                    value={formData?.end_date}
                    onChange={endDate}
                    renderInput={(params) => (
                      <TextField
                        className={styles.taskInputField}
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={3}
                >
                  <Button type="submit" variant="contained">
                    Add Task
                  </Button>
                  <Button type="reset" variant="contained" color="secondary">
                    Reset
                  </Button>
                </Stack>
              </form>
            </Container>
          </Box>
        </Drawer>
      </Container>
    </Page>
  );
}
// Task.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

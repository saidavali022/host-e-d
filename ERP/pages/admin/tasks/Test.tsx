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

import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
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
} from "@mui/material";
// components
import Page from "@components/Page";
import { useMemo } from "react";
import NextLink from "next/link";
//-----------------------

export default function Test() {
  const [editId, setEditId] = useState();
  const [rowData, setrowData] = useState([]);
  const [anchor, setanchor] = useState(false);
  const [InputDate, setInputDate] = useState("text");
  const [optionEmp, setoptionEmp] = useState("");
  const [priorityTeam, setpriorityTeam] = useState("");
  const [departments, setdepartments] = useState();

  const [designationData, setDesignationData] = useState([]);

  const [username, setusername] = useState();

  const [userData, setuserData] = useState([]);
  const changeoptionEmp = (event: any) => {
    setoptionEmp(event.target.value);
  };

  const changepriorityTeam = (event: any) => {
    setpriorityTeam(event.target.value);
  };

  const [optionTeam, setoptionTeam] = useState("");
  const changeoptionTeam = (event: any) => {
    setoptionTeam(event.target.value);
    designation(event.target.value);
  };

  const [formData, setformData] = useState();

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
    // console.log(formData);
    const formBindData = new FormData();
    formBindData.append("title", formData.title);
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
        }
      })
      .catch(function (error: any) {
        toast.error("error");
      });
  };

  const getTasklist = () => {
    axios({
      method: "get",
      url: "/tasks/",
    })
      .then(function (response: any) {
        // console.log(response);
        if (response.status === 200) {
          setrowData(response.data.data);
        }
      })
      .catch(function (error: any) {});
  };

  const getuserData = () => {
    axios({
      method: "get",
      url: "/users/info/",
    })
      .then(function (response: any) {
        if (response.status === 200) {
          setuserData(response.data);
        }
      })
      .catch(function (error: any) {});
  };

  useEffect(() => {
    getTasklist();
    getuserData();
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
    const Dataa = userData.filter((item, index) => item.employee_id == value);
    if (Dataa[0]) {
      setusername(Dataa[0]?.username);
    }

    console.log(value);
  };

  useMemo(() => {
    const editDate = rowData.filter(
      (rowData: any) => rowData.id == editId || 0
    );
    if (editDate[0]) {
      setformData(editDate[0]);
      designation(editDate[0]?.team);
      getUsername(editDate[0]?.employee_id);
      console.log(editDate[0]?.employee_id);
    }
  }, [editId]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "S.No", width: 100, hide: true },
    { field: "team", headerName: "Team", width: 250 },
    { field: "employee_id", headerName: "Employee ID", width: 250 },
    { field: "priority", headerName: "priority", width: 250 },
    { field: "title", headerName: "Title", width: 250 },

    { field: "status", headerName: "Status", width: 250 },
    {
      field: "start_date",
      headerName: "Start Date",
      width: 250,
      renderCell: (params: GridRenderCellParams) =>
        moment(params.row.start_date).utc().format("DD-MM-YYYY"),
    },
    {
      field: "end_date",
      headerName: "End Date",
      width: 250,
      renderCell: (params: GridRenderCellParams) =>
        moment(params.row.end_date).utc().format("DD-MM-YYYY"),
    },

    {
      field: "action",
      headerName: "Action",
      type: "actions",
      width: 220,
      renderCell: renderAction,
    },
  ];

  // const [value, setValue] = useState<Date | null>(new Date());

  // value={moment(formData?.end_date).utc().format("DD-MM-YYYY")}
  // console.log(store.getState());

  // const todo = useSelector((state) => state.changeNumber);
  // const dispatch = useDispatch();

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

      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={rowData}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>

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
                onChange={(event) => {
                  getFormData(event);
                  changepriorityTeam(event);
                }}
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
                  changeoptionTeam(event);
                }}
                value={formData?.team}
              >
                {departmentsData.map((item, index) => {
                  return (
                    <MenuItem value={departmentsData[index].department}>
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
                  return (
                    <MenuItem value={designationData[index].employee_id}>
                      {designationData[index].username}
                    </MenuItem>
                  );
                })}
              </TextField>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Start Date"
                  inputFormat="MM/dd/yyyy"
                  value={formData?.start_date}
                  onChange={startDate}
                  renderInput={(params) => (
                    <TextField className={styles.taskInputField} {...params} />
                  )}
                />

                <DesktopDatePicker
                  label="End Date"
                  inputFormat="MM/dd/yyyy"
                  value={formData?.end_date}
                  onChange={endDate}
                  renderInput={(params) => (
                    <TextField className={styles.taskInputField} {...params} />
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
      {ToastContainer_box}
    </Page>
  );
}
// Task.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

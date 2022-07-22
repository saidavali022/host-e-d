import { useState, useEffect, useMemo, useReducer } from "react";
import type { ReactElement } from "react";
import DashboardLayout from "@layouts/hrdashboard";
import NextLink from "next/link";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
// material
import {
  Card,
  Stack,
  Grid,
  Container,
  Typography,
  Autocomplete,
  Button,
  Breadcrumbs,
  DialogContent,
  Box,
  DialogActions,
  TextField,
  MenuItem,
  Drawer,
} from "@mui/material";
import {
  LocalizationProvider,
  MobileDatePicker,
  MobileDateTimePicker,
  TabContext,
  TabList,
  TabPanel,
} from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fDateTimeSuffix } from "@utils/formatTime";
// components
import Page from "@components/Page";
import { fDate } from "@utils/formatTime";
import styles from "@styles/Users.module.css";
import clsx from "clsx";
import {
  GridColumns,
  DataGrid,
  GridCellParams,
  GridColDef,
  GridValueGetterParams,
  GridValueSetterParams,
  GridRenderCellParams,
  GridRowsProp,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import Label from "@components/Label";
import { colorStatusPriority } from "@utils/chipsColor";
import { addDays } from "date-fns";

//----------------------
const interviewAppointmentInitialState = {
  id: null,
  title: "",
  name: "",
  phone: "",
  location: "",
  email: "",
  status: "",
  interview_status: "",
  response: "",
  description: "",
  start: new Date(),
  end: new Date(),
  kind: "kind#interview",
};
const interviewAppointmentFiltersInitialState = {
  id: null,
  title: "",
  name: null,
  phone: null,
  location: null,
  email: null,
  status: null,
  interview_status: null,
  response: null,
  description: null,
  start: new Date(),
  end: addDays(new Date(), 31),
  kind: "kind#interview",
};

export default function Interviews() {
  const globalState = useSelector((state) => state.globalState);
  const [rowData, setRowData] = useState([]);
  const [formData, setFormData] = useState();
  const [updateCounter, setUpdateCounter] = useState(0);
  const [anchor, setanchor] = useState(false);
  const [selectId, setselectId] = useState(0);
  const [interviewAppointmentInput, setInterviewAppointmentInput] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    interviewAppointmentInitialState
  );

  const [interviewAppointmentFilterInput, setInterviewAppointmentFiltersInput] =
    useReducer(
      (state: any, newState: any) => ({ ...state, ...newState }),
      interviewAppointmentFiltersInitialState
    );

  const columns: GridColumns = [
    {
      field: "id",
      hide: true,
      hideable: false,
    },
    { field: "title", headerName: "Title", width: 150 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "response", headerName: "Comment", width: 250 },
    {
      field: "start",
      headerName: "Start Date",
      width: 150,
      valueGetter: (params: GridValueGetterParams) =>
        params.row?.start && fDateTimeSuffix(new Date(params.row.start)),
    },
    {
      field: "end",
      headerName: "End Date",
      width: 150,
      valueGetter: (params: GridValueGetterParams) =>
        params.row?.end && fDateTimeSuffix(new Date(params.row.end)),
    },
    { field: "status", headerName: "Status", width: 150 },
    { field: "interview_status", headerName: "Interview Status", width: 250 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "phone", headerName: "Phone" },
    { field: "location", headerName: "Location" },
    {
      field: "action",
      headerName: "Action",
      type: "actions",
      width: 100,
      getActions: () => [
        <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
      ],
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="contained"
          onClick={() => {
            setanchor(true);
            setInterviewAppointmentInput({
              id: params.row.id,
              title: params.row.title,
              description: params.row.description,
              start: new Date(params.row.start),
              end: new Date(params.row.end),
              name: params.row.name,
              email: params.row.email,
              phone: params.row.phone,
              location: params.row.location,
              interview_status: params.row.interview_status,
              status: params.row.status,
              response: params.row.response,
              kind: "kind#interview",
            });
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const handleInterviewFilter = (event: any) => {
    event.preventDefault();
    getUserInterviews();
  };

  const handleResetEvents = () => {
    setInterviewAppointmentInput(interviewAppointmentInitialState);
  };

  const handleEventDelete = (event: any) => {
    event.preventDefault();
    let data = { ...interviewAppointmentInput };

    if (data.id == null) {
      return;
    }

    axios
      .delete(`/users/events/${globalState.Employee_id}/${data.id}`)
      .then((res: any) => {
        setanchor(false);
        toast.success("Successful", { theme: "colored" });
        setUpdateCounter(updateCounter + 1);
      })
      .catch((error: any) => {
        console.error("Appointment Delete ", error);
        toast.error("Internal Server Error", { theme: "colored" });
      });
  };

  const handleInterviewAppointmentInput = (event: any) => {
    const name = event.target.name;
    const newValue = event.target.value;
    setInterviewAppointmentInput({ [name]: newValue });
  };

  const handleInterviewAppointmentCreate = (event: any) => {
    event.preventDefault();
    let data = { ...interviewAppointmentInput };
    if (interviewAppointmentInput.id == null) {
      axios
        .post(`users/events/interview/${globalState.Employee_id}`, data)
        .then((res: any) => {
          setanchor(false);
          toast.success("Successful", {
            theme: "colored",
          });
          setUpdateCounter(updateCounter + 1);
        })
        .catch((error: any) => {
          toast.error("Something Went Wrong", {
            theme: "colored",
          });
        });
    }

    if (interviewAppointmentInput.id != null) {
      axios
        .put(
          `/users/events/interview/${globalState.Employee_id}/${interviewAppointmentInput.id}`,
          data
        )
        .then((res: any) => {
          setanchor(false);
          toast.success("Successful", {
            theme: "colored",
          });
          setUpdateCounter(updateCounter + 1);
        })
        .catch((error: any) => {
          toast.error("Something Went Wrong", {
            theme: "colored",
          });
        });
    }
  };

  const getUserInterviews = () => {
    axios
      .get(`/users/events/interview/${globalState.Employee_id}`, {
        params: {
          start: interviewAppointmentFilterInput.start,
          end: interviewAppointmentFilterInput.end,
        },
      })
      .then(function (response: any) {
        if (response.status === 200) {
          // console.info("res - ", response);
          setRowData(response.data);
        }
      })
      .catch(function (error: any) {});
  };

  useEffect(() => {
    getUserInterviews();
  }, [updateCounter]);

  return (
    <Page title="Interviews | E & D 360">
      <Container>
        <Stack
          direction="row"
          alignItems="start"
          justifyContent="space-between"
          mb={3}
        >
          {" "}
          <Stack
            direction="column"
            alignItems="start"
            justifyContent="space-between"
          >
            <Typography variant="h4" gutterBottom>
              Interview
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <NextLink href="/hr">Dashboard</NextLink>
              <Typography color="text.primary">Interview</Typography>
            </Breadcrumbs>
          </Stack>
          <Stack
            direction="column"
            alignItems="end"
            justifyContent="space-between"
          >
            <Button
              variant="contained"
              onClick={() => {
                handleResetEvents();
                setanchor(true);
              }}
            >
              New Interview
            </Button>
          </Stack>
        </Stack>
        <form onSubmit={handleInterviewFilter} autoComplete="off">
          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            <Grid item xs={6} sm={4} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  label="Start Time"
                  name="start"
                  value={interviewAppointmentFilterInput.start}
                  onChange={(newValue: Date | null) => {
                    setInterviewAppointmentFiltersInput({ start: newValue });
                  }}
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      helperText={null}
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6} sm={4} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  label="End Time"
                  name="end"
                  inputFormat="dd/MM/yyyy"
                  value={interviewAppointmentFilterInput.end}
                  onChange={(newValue: Date | null) => {
                    setInterviewAppointmentFiltersInput({ end: newValue });
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      helperText={null}
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={4} md={2} sx={{ margin: "auto 0" }}>
              <Button variant="contained" type="submit">
                Filter
              </Button>
            </Grid>
          </Grid>
        </form>

        <Card
          sx={{
            height: 650,
            width: 1,
          }}
        >
          <DataGrid
            rows={rowData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Card>
        <Drawer anchor="right" open={anchor} onClose={() => setanchor(false)}>
          <Box sx={{ width: 450 }}>
            <Container>
              <form
                onSubmit={handleInterviewAppointmentCreate}
                autoComplete="off"
              >
                <TextField
                  autoFocus
                  margin="normal"
                  name="title"
                  label="Title"
                  type="text"
                  fullWidth
                  variant="outlined"
                  onChange={handleInterviewAppointmentInput}
                  value={interviewAppointmentInput.title}
                  required
                />
                <TextField
                  autoFocus
                  margin="normal"
                  name="description"
                  label="Description"
                  type="text"
                  fullWidth
                  variant="outlined"
                  onChange={handleInterviewAppointmentInput}
                  value={interviewAppointmentInput.description}
                />
                <TextField
                  autoFocus
                  margin="normal"
                  name="response"
                  label="Comments"
                  type="text"
                  fullWidth
                  variant="outlined"
                  onChange={handleInterviewAppointmentInput}
                  value={interviewAppointmentInput.response}
                />
                <TextField
                  autoFocus
                  margin="normal"
                  name="name"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  onChange={handleInterviewAppointmentInput}
                  value={interviewAppointmentInput.name}
                />
                <TextField
                  autoFocus
                  margin="normal"
                  name="phone"
                  label="Phone"
                  type="text"
                  fullWidth
                  variant="outlined"
                  onChange={handleInterviewAppointmentInput}
                  value={interviewAppointmentInput.phone}
                />
                <TextField
                  autoFocus
                  margin="normal"
                  name="email"
                  label="Email"
                  type="text"
                  fullWidth
                  variant="outlined"
                  onChange={handleInterviewAppointmentInput}
                  value={interviewAppointmentInput.email}
                />
                <TextField
                  autoFocus
                  margin="normal"
                  name="location"
                  label="Location"
                  type="text"
                  fullWidth
                  variant="outlined"
                  onChange={handleInterviewAppointmentInput}
                  value={interviewAppointmentInput.location}
                />
                <Autocomplete
                  disablePortal
                  onInputChange={(event, newInputValue) => {
                    setInterviewAppointmentInput({ status: newInputValue });
                  }}
                  value={interviewAppointmentInput.status}
                  options={["Confirmed", "Not Confirmed", "Declined", "Absent"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Status"
                      margin="normal"
                      name="status"
                      fullWidth
                    />
                  )}
                />
                <TextField
                  autoFocus
                  margin="normal"
                  name="interview_status"
                  label="Interview Status"
                  type="text"
                  fullWidth
                  variant="outlined"
                  onChange={handleInterviewAppointmentInput}
                  value={interviewAppointmentInput.interview_status}
                />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDateTimePicker
                    label="Start Time"
                    name="start"
                    minDate={new Date()}
                    inputFormat="dd/MM/yyyy hh:mm a"
                    value={interviewAppointmentInput.start}
                    onChange={(newValue: Date | null) => {
                      setInterviewAppointmentInput({ start: newValue });
                      setInterviewAppointmentInput({ end: newValue });
                    }}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        helperText={null}
                        margin="normal"
                        fullWidth
                      />
                    )}
                  />
                  <MobileDateTimePicker
                    label="End Time"
                    minDate={new Date()}
                    name="end"
                    inputFormat="dd/MM/yyyy hh:mm a"
                    value={interviewAppointmentInput.end}
                    onChange={(newValue: Date | null) => {
                      setInterviewAppointmentInput({ end: newValue });
                    }}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        helperText={null}
                        margin="normal"
                        fullWidth
                      />
                    )}
                  />
                </LocalizationProvider>
                <DialogActions>
                  {interviewAppointmentInput.id !== null && (
                    <Button onClick={handleEventDelete}>Delete</Button>
                  )}
                  <Button
                    onClick={() => {
                      setanchor(false);
                    }}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Save
                  </Button>
                </DialogActions>
              </form>
            </Container>
          </Box>
        </Drawer>
      </Container>
    </Page>
  );
}

// Interviews.getLayout = (page: ReactElement) => (
//   <DashboardLayout>{page}</DashboardLayout>
// );

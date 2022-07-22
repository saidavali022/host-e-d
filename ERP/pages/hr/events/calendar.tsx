import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { compareAsc } from "date-fns";
import { useState, useEffect, useRef, useReducer } from "react";
import type { ReactElement } from "react";
import DashboardLayout from "@layouts/hrdashboard";
import NextLink from "next/link";
// material
import {
  Card,
  Stack,
  Autocomplete,
  Container,
  Typography,
  Button,
  Breadcrumbs,
  Box,
  DialogContent,
  TextField,
  Dialog,
  FormControl,
  Tab,
  Chip,
  DialogActions,
  OutlinedInput,
  InputLabel,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// components
import Page from "@components/Page";
//Fullcalendar
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios, { toast } from "@utils/defaultImports";
import {
  LocalizationProvider,
  MobileDateTimePicker,
  TabContext,
  TabList,
  TabPanel,
} from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useSelector } from "react-redux";
//---------------------------------------------

/**
 * TODO: getEvents is calling server each time any state change are made like filling an input field.
 * useMemo or some react feature to only call to the server when an event is successful like event create/update success
 */

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const appUsers = [
  {
    id: "END1111",
    name: "mohammed",
  },
  {
    id: "ED250222SHA1603",
    name: "Shaik",
  },
  {
    id: "END1113",
    name: "Tarassal",
  },
];

const appointmentInitialState = {
  id: null,
  title: "",
  description: null,
  attendees: [],
  start: new Date(),
  end: new Date(),
  kind: "kind#appointment",
};

const interviewAppointmentInitialState = {
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
  end: new Date(),
  kind: "kind#interview",
};

export default function Calendar() {
  // const calendarRef = useRef(null);
  // const globalState = useSelector((state) => state.globalState);
  const globalState = {
    Employee_id: "END1111",
  };

  const [openModel, setOpenModel] = useState(false);
  const [tabIndex, setTabIndex] = useState("appointment");
  const [appointmentInput, setAppointmentInput] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    appointmentInitialState
  );

  const [interviewAppointmentInput, setInterviewAppointmentInput] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    interviewAppointmentInitialState
  );

  const handleResetEvents = () => {
    setAppointmentInput(appointmentInitialState);
    setInterviewAppointmentInput(interviewAppointmentInitialState);
  };

  const handleModelClose = () => {
    setOpenModel(false);
  };

  const handleDateSelect = (event: any) => {
    handleResetEvents();

    setAppointmentInput({ start: event.start });
    setAppointmentInput({ end: event.end });
    setInterviewAppointmentInput({ start: event.start });
    setInterviewAppointmentInput({ end: event.end });
    setOpenModel(true);
  };

  const handleSelectAttendee = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;

    setAppointmentInput({
      attendees: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleEventClick = (event: any) => {
    const eventId = event.event._def.publicId;

    axios
      .get(`users/events/${globalState.Employee_id}/${eventId}`, {})
      .then((res: any) => {
        if (res.status !== 200) {
          toast.error("Something went Wrong", {
            theme: "colored",
          });
          return;
        }

        const event = {
          id: res.data.event_id,
          title: res.data.title,
          start: res.data.start,
          end: res.data.end,
          kind: res.data.kind,
          description: res.data?.description,
          status: res.data?.status,
          interview_status: res.data?.interview_status,
          name: res.data.event_attendees[0]?.name,
          email: res.data.event_attendees[0]?.email,
          phone: res.data.event_attendees[0]?.phone,
          location: res.data.event_attendees[0]?.location,
          response: res.data.event_attendees[0]?.response,
          attendees: res.data?.event_attendees?.map(
            (attendee: any) => attendee?.attendee_id
          ),
        };

        if (res.data.kind === "kind#appointment") {
          setTabIndex("appointment");
          setAppointmentInput({
            id: event.id,
            start: new Date(event.start),
            end: new Date(event.end),
            attendees: event?.attendees,
            title: event.title,
            description: event.description,
          });
        }

        if (res.data.kind === "kind#interview") {
          setTabIndex("interview");
          setInterviewAppointmentInput({
            id: event.id,
            title: event.title,
            description: event.description,
            start: new Date(event.start),
            end: new Date(event.end),
            name: event.name,
            email: event.email,
            phone: event.phone,
            location: event.location,
            interview_status: event.interview_status,
            status: event.status,
            response: event.response,
            kind: "kind#interview",
          });
        }

        setOpenModel(true);
      })
      .catch(function (error: any) {
        console.error(error);
      });
  };

  const handleAppointmentInput = (event: any) => {
    const name = event.target.name;
    const newValue = event.target.value;
    setAppointmentInput({ [name]: newValue });
  };

  const handleInterviewAppointmentInput = (event: any) => {
    const name = event.target.name;
    const newValue = event.target.value;
    setInterviewAppointmentInput({ [name]: newValue });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
  };

  const handleEventDelete = (event: any) => {
    event.preventDefault();
    let data = null;

    if (tabIndex == "appointment") {
      data = { ...appointmentInput };
    }

    if (tabIndex == "interview") {
      data = { ...interviewAppointmentInput };
    }

    if (data.id == null) {
      return;
    }

    axios
      .delete(`/users/events/${globalState.Employee_id}/${data.id}`)
      .then((res: any) => {
        setOpenModel(false);
        toast.success("Successful", { theme: "colored" });
      })
      .catch((error: any) => {
        console.error("Appointment Delete ", error);
        toast.error("Internal Server Error", { theme: "colored" });
      });
  };

  const handleInterviewAppointmentCreate = (event: any) => {
    event.preventDefault();
    let data = { ...interviewAppointmentInput };
    if (interviewAppointmentInput.id == null) {
      axios
        .post(`users/events/interview/${globalState.Employee_id}`, data)
        .then((res: any) => {
          setOpenModel(false);
          toast.success("Successful", {
            theme: "colored",
          });
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
          setOpenModel(false);
          toast.success("Successful", {
            theme: "colored",
          });
        })
        .catch((error: any) => {
          toast.error("Something Went Wrong", {
            theme: "colored",
          });
        });
    }
  };

  const handleEventCreate = (event: any) => {
    event.preventDefault();
    let data = { ...appointmentInput };
    if (appointmentInput.id == null) {
      axios
        .post(`users/events/${globalState.Employee_id}`, data)
        .then((res: any) => {
          setOpenModel(false);
          toast.success("Successful", {
            theme: "colored",
          });
        })
        .catch((error: any) => {
          toast.error("Something Went Wrong", {
            theme: "colored",
          });
        });
    }

    if (appointmentInput.id != null) {
      axios
        .put(
          `/users/events/${globalState.Employee_id}/${appointmentInput.id}`,
          data
        )
        .then((res: any) => {
          setOpenModel(false);
          toast.success("Successful", {
            theme: "colored",
          });
        })
        .catch((error: any) => {
          toast.error("Something Went Wrong", {
            theme: "colored",
          });
        });
    }
  };

  const getEvents = (
    info: { start?: Date; startStr?: string; end?: Date; endStr?: string },
    successCallback: (arg0: { title: any; start: any; end: any }[]) => void,
    failureCallback: (arg0: any) => void
  ) => {
    axios
      .get(`/users/events/${globalState.Employee_id}`, {
        params: {
          start: info.startStr,
          end: info.endStr,
        },
      })
      .then((res: any) => {
        const events = res.data.map((eventData: any) => ({
          id: eventData.event_id,
          title: eventData.title,
          start: eventData.start,
          end: eventData.end,
        }));
        successCallback(events);
      })
      .catch(function (error: any) {
        failureCallback(error);
      });
  };

  return (
    <Page title="Calendar | E & D 360">
      <Container maxWidth={false}>
        <Stack
          direction="row"
          alignItems="start"
          justifyContent="space-between"
          mb={5}
        >
          {" "}
          <Stack
            direction="column"
            alignItems="start"
            justifyContent="space-between"
          >
            <Typography variant="h4" gutterBottom>
              Calendar
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <NextLink href="/hr">Dashboard</NextLink>
              <Typography color="text.primary">Calendar</Typography>
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
                setOpenModel(true);
              }}
            >
              New Event
            </Button>
          </Stack>
        </Stack>
        <Card>
          <FullCalendar
            // innerRef={calendarRef}
            initialView="dayGridMonth"
            plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
            events={getEvents}
            headerToolbar={{
              left: "dayGridMonth,timeGridWeek,timeGridDay,dayGridDay",
              center: "prev,title,next",
              right: "today",
            }}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            // weekends={this.state.weekendsVisible}
            // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={handleDateSelect}
            // eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            // eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
          {/* Calendar Model */}
          <Dialog
            open={openModel}
            onClose={handleModelClose}
            fullWidth={true}
            maxWidth="xs"
          >
            <TabContext value={tabIndex}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Meeting" value="appointment" />
                  <Tab label="Remainder" value="remainder" />
                  <Tab label="Interview" value="interview" />
                </TabList>
              </Box>
              <TabPanel value="appointment">
                <form onSubmit={handleEventCreate} autoComplete="off">
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="normal"
                      id="title"
                      name="title"
                      label="Title"
                      type="text"
                      fullWidth
                      variant="outlined"
                      onChange={handleAppointmentInput}
                      value={appointmentInput.title}
                      required
                    />
                    <TextField
                      autoFocus
                      margin="normal"
                      id="description"
                      name="description"
                      label="Description"
                      type="text"
                      fullWidth
                      variant="outlined"
                      onChange={handleAppointmentInput}
                      value={appointmentInput.description}
                    />
                    {/* <FormGroup>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="All Day"
                      />
                    </FormGroup> */}
                    <FormControl fullWidth>
                      <InputLabel id="multiple-attendees-checkbox-label">
                        Attendees
                      </InputLabel>
                      <Select
                        labelId="multiple-attendees-checkbox-label"
                        id="attendee-multi-select"
                        multiple
                        name="attendee-multi-select"
                        onChange={handleSelectAttendee}
                        value={appointmentInput.attendees}
                        input={<OutlinedInput label="Attendees" />}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {appUsers
                          .filter((user) => {
                            return user.id !== globalState.Employee_id; // TODO dynamic login user id
                          })
                          .map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                              <Checkbox
                                checked={
                                  appointmentInput.attendees.indexOf(user.id) >
                                  -1
                                }
                              />
                              <ListItemText primary={user.name} />
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileDateTimePicker
                        label="Start Time"
                        name="start"
                        minDate={new Date()}
                        inputFormat="dd/MM/yyyy hh:mm a"
                        value={appointmentInput.start}
                        onChange={(newValue: Date | null) => {
                          setAppointmentInput({ start: newValue });
                          setAppointmentInput({ end: newValue });
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
                        value={appointmentInput.end}
                        onChange={(newValue: Date | null) => {
                          setAppointmentInput({ end: newValue });
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
                  </DialogContent>
                  <DialogActions>
                    {appointmentInput.id !== null && (
                      <Button onClick={handleEventDelete}>Delete</Button>
                    )}
                    <Button onClick={handleModelClose} variant="contained">
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                      Save
                    </Button>
                  </DialogActions>
                </form>
              </TabPanel>
              <TabPanel value="remainder">Remainder</TabPanel>
              <TabPanel value="interview">
                <form
                  onSubmit={handleInterviewAppointmentCreate}
                  autoComplete="off"
                >
                  <DialogContent>
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
                      options={[
                        "Confirmed",
                        "Not Confirmed",
                        "Declined",
                        "Absent",
                      ]}
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
                      label="interview Status"
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
                  </DialogContent>
                  <DialogActions>
                    {interviewAppointmentInput.id !== null && (
                      <Button onClick={handleEventDelete}>Delete</Button>
                    )}
                    <Button onClick={handleModelClose} variant="contained">
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                      Save
                    </Button>
                  </DialogActions>
                </form>
              </TabPanel>
            </TabContext>
          </Dialog>
        </Card>
      </Container>
    </Page>
  );
}
// Calendar.getLayout = (page: ReactElement) => (
//   <DashboardLayout>{page}</DashboardLayout>
// );

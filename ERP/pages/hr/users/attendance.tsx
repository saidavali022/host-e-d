import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useState, useEffect, useMemo } from "react";
import type { ReactElement } from "react";
import DashboardLayout from "@layouts/dashboard";
import { differenceInMinutes } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useSelector } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  fDate,
  fTime,
  fToNow,
  fformatRelative,
  fTimeDistanceInMinutes,
  fdifferenceInMinutes,
  fDistanceInHrsAndMinutes,
  fMinutesToWords,
  fSubMinutes,
  fAddHours,
} from "@utils/formatTime";
import NextLink from "next/link";
import { IBreak } from "@utils/interfaces/common";
// material
import {
  Card,
  Stack,
  Box,
  Grid,
  Container,
  Typography,
  Button,
  Breadcrumbs,
  TextField,
  Avatar,
  Autocomplete,
  CircularProgress,
  ButtonBase,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  DataGrid,
  GridToolbar,
  GridColDef,
  GridValueGetterParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
// components
import Page from "@components/Page";
import Label from "@components/Label";
import {
  colorStatusPriority,
  renderBreakPills,
  getTotalBreakTime,
} from "@utils/chipsColor";
import axios from "@utils/defaultImports";

interface Employee {
  id?: string;
  employee_id?: string;
  username?: string;
  department?: string;
  passportSizePhoto?: string;
}

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function Attendance() {
  const [presentUser, setPresentUser] = useState<Employee>({});
  const [calDate, setCalDate] = useState<Date | null>(new Date());
  const [inputValue, setInputValue] = useState("");
  const [users, setUsers] = useState<Employee[]>([]);
  const [value, setValue] = useState<string | null>(null);
  const [rows, setRows] = useState([]);

  const handleUserSelect = (
    event: SelectChangeEvent,
    newValue: Employee | null
  ) => {
    // console.info("new value", newValue);
    console.info("new value", newValue?.username);
    setPresentUser(newValue);
    setValue(newValue?.username);
  };

  const handleCalDateChange = (newValue: Date | null) => {
    setCalDate(newValue);
  };

  useEffect(() => {
    if (presentUser.employee_id != null) {
      axios
        .get(`/attendance/${presentUser.employee_id}`, {
          params: {
            date: calDate,
          },
        })
        .then((res: any) => {
          console.info("api response -", res);
          setRows(res.data);
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  }, [presentUser, calDate]);

  useEffect(() => {
    //getUsers
    axios.get("/users/info").then((res: any) => {
      setUsers(res.data);
    });
  }, []);

  const columns: GridColDef[] = [
    {
      field: "id",
      hide: true,
      hideable: false,
    },
    {
      field: "date_in",
      headerName: "Date",
      type: "date",
      width: 100,
      hideable: false,
      valueGetter: (params: GridValueGetterParams) => {
        return fDate(params.row?.date_in);
      },
    },
    {
      field: "shift_in",
      headerName: "Shift In",
      minWidth: 90,
      type: "string",
      valueGetter: (params: GridValueGetterParams) => {
        return fTime(params.row.shift_in);
      },
    },
    {
      field: "log_in",
      headerName: "Log In",
      width: 90,
      valueGetter: (params: GridValueGetterParams) => {
        return fTime(params.row.log_in);
      },
    },
    {
      field: "breaks",
      headerName: "Breaks",
      minWidth: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        renderBreakPills(params.row.breaks),
    },
    {
      field: "shift_out",
      headerName: "Shift Out",
      minWidth: 90,
      type: "string",
      valueGetter: (params: GridValueGetterParams) => {
        return fTime(params.row.shift_out);
      },
    },
    {
      field: "log_out",
      headerName: "Log Out",
      width: 90,
      valueGetter: (params: GridValueGetterParams) => {
        if (params.row.log_out == null) {
          return "-";
        }
        return fTime(params.row.log_out);
      },
    },
    {
      field: "over_time",
      headerName: "Over Time",
      minWidth: 90,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => {
        if (params.row.log_out == null) {
          return "-";
        }

        let department = presentUser?.department;
        const shiftMinutes = fdifferenceInMinutes(
          params.row.shift_out,
          params.row.shift_in
        );
        const workedMinute = fdifferenceInMinutes(
          params.row.log_out,
          params.row.log_in
        );
        let over_time_minutes = workedMinute - shiftMinutes;
        console.info(
          "user over time ",
          over_time_minutes,
          workedMinute,
          shiftMinutes
        );
        console.info("department", department);
        if (department === "software development" && over_time_minutes > 30) {
          return fMinutesToWords(over_time_minutes);
        }

        if (
          ["lead generation", "tech support"].includes(department) &&
          over_time_minutes > 60
        ) {
          return fMinutesToWords(over_time_minutes);
        }

        return "-";
      },
    },
    {
      field: "total_break",
      headerName: "Total Break",
      minWidth: 130,
      valueGetter: (params: GridValueGetterParams) => {
        return fMinutesToWords(getTotalBreakTime(params.row.breaks));
      },
    },
    {
      field: "total_available_time",
      headerName: "Total Available Time",
      minWidth: 150,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => {
        return fDistanceInHrsAndMinutes(params.row.log_out, params.row.log_in);
      },
    },
    {
      field: "total_work_hours",
      headerName: "Total Work Hours",
      minWidth: 150,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => {
        return fDistanceInHrsAndMinutes(
          fSubMinutes(params.row.log_out, getTotalBreakTime(params.row.breaks)),
          params.row.log_in
        );
      },
    },
  ];

  return (
    <Page title="Attendance | E & D 360">
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
              Attendance
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <NextLink href="/hr">Dashboard</NextLink>
              <Typography color="text.primary">Attendance</Typography>
            </Breadcrumbs>
          </Stack>
        </Stack>

        <Grid container spacing={2} sx={{ paddingBottom: 2 }}>
          <Grid item>
            <ButtonBase sx={{ width: 80, height: 80 }}>
              <Avatar
                alt="Robert Smith"
                src={`${process.env.NEXT_PUBLIC_HOST}/${presentUser?.passportSizePhoto}`}
                sx={{ width: 80, height: 80 }}
              />
            </ButtonBase>
          </Grid>
          <Grid item xs="auto" md={3} container direction="column" spacing={2}>
            <Grid item>
              <Typography gutterBottom variant="subtitle1" component="div">
                {presentUser?.username}
              </Typography>
              <Typography variant="body2" gutterBottom>
                SUDO NAME: {presentUser?.sudo_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {presentUser?.employee_id}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs={12} md="auto" sx={{ padding: 2 }}>
              <Autocomplete
                id="user-select"
                sx={{ minWidth: 300 }}
                options={users}
                autoHighlight
                getOptionLabel={(option) => option.username}
                onChange={handleUserSelect}
                value={value}
                inputValue={inputValue}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    <Avatar
                      alt={option.username}
                      src={`${process.env.NEXT_PUBLIC_HOST}/${option.passportSizePhoto}`}
                      sx={{ width: 20, height: 20, mx: 1 }}
                    />
                    {option.username} - {option.employee_id}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Employee"
                    InputProps={{
                      ...params.InputProps,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md="auto" sx={{ padding: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={["year", "month"]}
                  label="Year and Month"
                  maxDate={new Date()}
                  value={calDate}
                  onChange={handleCalDateChange}
                  renderInput={(params) => (
                    <TextField {...params} helperText={null} />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Grid>
        <Card
          sx={{
            height: 350,
            width: 1,
          }}
        >
          {" "}
          <DataGrid
            rows={rows}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            hideFooter={true}
            disableColumnMenu
          />
        </Card>
      </Container>
    </Page>
  );
}

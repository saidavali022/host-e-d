import { filter } from "lodash";
import { sentenceCase } from "change-case";
import type { ReactElement } from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { differenceInMinutes } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers";
import UserDashboardLayout from "@layouts/userdashboard";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "@utils/defaultImports";
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
  Container,
  Typography,
  Button,
  Breadcrumbs,
  TextField,
} from "@mui/material";
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

export default function Attendance() {
  const globalState = useSelector((state) => state.globalState);
  const [calDate, setCalDate] = useState<Date | null>(new Date());
  const [rows, setRows] = useState([]);
  useEffect(() => {
    axios
      .get(`/attendance/${globalState.Employee_id}`, {
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
  }, [calDate]);

  const handleCalDateChange = (newValue: Date | null) => {
    setCalDate(newValue);
  };

  const columns: GridColDef[] = [
    // {
    //   field: "id",
    //   hide: true,
    //   hideable: false,
    // },
    {
      field: "date_in",
      headerName: "Date",
      type: "date",
      width: 100,
      hideable: false,
      valueGetter: (params: GridValueGetterParams) =>
        fDate(params.row?.date_in),
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
      type: "string",
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        renderBreakPills(params.row?.breaks),
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
        // return fdifferenceInMinutes(params.row.shift_out, params.row.shift_in);
        if (params.row.log_out == null) {
          return "-";
        }

        let department = globalState?.department;
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
              <NextLink href="/dashboard">Dashboard</NextLink>
              <Typography color="text.primary">Attendance</Typography>
            </Breadcrumbs>
          </Stack>
          <Stack
            direction="column"
            alignItems="end"
            justifyContent="space-between"
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={["month", "year"]}
                label="Year and Month"
                maxDate={new Date()}
                value={calDate}
                onChange={handleCalDateChange}
                renderInput={(params) => (
                  <TextField {...params} helperText={null} />
                )}
              />
            </LocalizationProvider>
          </Stack>
        </Stack>

        <Card
          sx={{
            height: 350,
            width: 1,
          }}
        >
          <DataGrid
            // getRowId={(row) => row.internalId}
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

import { useState, useEffect } from "react";
import * as Yup from "yup";
import {
  Box,
  Typography,
  Button,
  ListItemAvatar,
  Avatar,
  Card,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
  TextField,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import axios, { toast } from "@utils/defaultImports";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useFormik, Form, FormikProvider } from "formik";
import {
  fTime,
  fDateTimeSuffix,
  fDistanceInHrsAndMinutes,
} from "@utils/formatTime";
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

export default function UserShiftChange() {
  const theme = useTheme();
  const [department, setDepartment] = useState(null);
  const [rows, setRows] = useState([]);
  const [shift_in, setShiftStart] = useState<Date | null>(null);
  const [shift_out, setShiftEnd] = useState<Date | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[] | null>([]);
  const [formData, setformData] = useState({});
  // const ShiftSchema = Yup.object().shape({
  //   shift_in: Yup.date().required("shift-in required"),
  //   shift_out: Yup.date().required("shift-out required"),
  // });

  const formik = useFormik({
    initialValues: {
      employees: [],
      shift_in: null,
      shift_out: null,
    },
    // validationSchema: ShiftSchema,
    onSubmit: (values, actions) => {
      axios({
        method: "post",
        url: "/shifts",
        data: values,
      })
        .then(function (response: any) {
          if (response.status === 201) {
            toast.success("success", {
              theme: "colored",
            });
            actions.resetForm();
            getUserShifts();
          } else {
            toast.error("Error", {
              theme: "colored",
            });
          }
        })
        .catch(function (error: any) {
          console.error(error.response.data);
        });
    },
  });
  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps } =
    formik;

  useEffect(() => {
    getUserShifts();
  }, [department]);

  const getUserShifts = () => {
    axios
      .get(`/shifts`, {
        params: {
          department: department,
        },
      })
      .then((res: any) => {
        setRows(res.data);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const handleDepartmentChange = (event: SelectChangeEvent) => {
    setDepartment(event.target.value as string);
  };

  const columns: GridColDef[] = [
    // {
    //   field: "id",
    //   hide: true,
    //   hideable: false,
    // },
    {
      field: "employee_id",
      headerName: "EMP ID",
      minWidth: 90,
      type: "string",
    },
    {
      field: "username",
      headerName: "User Name",
      minWidth: 150,
    },
    {
      field: "shift_in",
      headerName: "Shift In",
      width: 90,
      valueGetter: (params: GridValueGetterParams) => {
        return fTime(params.row.shifts[0]?.shift_in);
      },
    },
    {
      field: "shift_out",
      headerName: "Shift Out",
      width: 90,
      valueGetter: (params: GridValueGetterParams) => {
        return fTime(params.row.shifts[0]?.shift_out);
      },
    },
    {
      field: "created",
      headerName: "Last Updated",
      minWidth: 170,
      valueGetter: (params: GridValueGetterParams) => {
        return fDateTimeSuffix(params.row.shifts[0]?.created_at);
      },
    },
  ];

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={2}
            sx={{ marginBottom: 1 }}
          >
            <Grid item xs={12} sm={6} md={4}>
              <FormControl sx={{ minWidth: 300 }} fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Department
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="department"
                  value={department == null ? "All" : department}
                  label="Department"
                  onChange={handleDepartmentChange}
                >
                  <MenuItem value={null}>All</MenuItem>
                  <MenuItem value="human resource management">
                    Human Resource Management
                  </MenuItem>
                  <MenuItem value="software development">
                    Software Development
                  </MenuItem>
                  <MenuItem value="lead generation">Lead Generation</MenuItem>
                  <MenuItem value="tech support">Tech Support</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl sx={{ minWidth: 300 }} fullWidth>
                <InputLabel id="multiple-checkbox-label">Employees</InputLabel>
                <Select
                  labelId="multiple-checkbox-label"
                  id="multiple-checkbox"
                  name="employees"
                  multiple
                  value={formik.values.employees}
                  onChange={formik.handleChange}
                  input={<OutlinedInput label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {rows.map((user) => (
                    <MenuItem key={user.id} value={user.employee_id}>
                      <Checkbox
                        checked={values.employees.includes(user.employee_id)}
                      />
                      <ListItemAvatar>
                        <Avatar
                          alt={user.username}
                          src={`${process.env.NEXT_PUBLIC_HOST}/${user.passportSizePhoto}`}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.username}
                        secondary={
                          <>
                            <Typography>{user.employee_id}</Typography>
                            <Typography>
                              {fTime(user.shifts[0]?.shift_in)}{" "}
                              {fTime(user.shifts[0]?.shift_out)}
                            </Typography>
                          </>
                        }
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Shift Start"
                  name="shift_in"
                  value={formik.values.shift_in}
                  onChange={(newValue) => {
                    formik.setFieldValue("shift_in", newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid
              item
              xs={6}
              sm={2}
              sx={{ marginTop: "auto", marginBottom: "auto" }}
            >
              {formik.values.shift_in && formik.values.shift_out != null
                ? fDistanceInHrsAndMinutes(
                    formik.values.shift_out.toString(),
                    formik.values.shift_in.toString()
                  )
                : "0 Hrs"}
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Shift End"
                  name="shift_out"
                  value={formik.values.shift_out}
                  onChange={(newValue) => {
                    formik.setFieldValue("shift_out", newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item sx={{ marginTop: "auto", marginBottom: "auto" }}>
              <Button
                variant="contained"
                type="reset"
                // color="info"
                sx={{ backgroundColor: theme.palette.grey[400] }}
              >
                Clear
              </Button>
            </Grid>
            <Grid item sx={{ marginTop: "auto", marginBottom: "auto" }}>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
      <Card
        sx={{
          width: 1,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter={true}
          autoHeight={true}
          disableColumnMenu
        />
      </Card>
    </>
  );
}

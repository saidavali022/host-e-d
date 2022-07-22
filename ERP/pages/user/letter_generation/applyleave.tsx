import { useState, useEffect } from "react";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import UserDashboardLayout from "@layouts/userdashboard";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { addDays } from "date-fns";
import { io } from "socket.io-client";

import {
  Container,
  Box,
  TextField,
  Stack,
  Card,
  Typography,
  MenuItem,
} from "@mui/material";
import styles from "@styles/Users.module.css";
import { fDate } from "@utils/formatTime";

function leave() {
  const socket = io("http://192.168.1.187:3001/");
  const router = useRouter();
  const [page, setpage] = useState();
  const [leaveType, setLeaveType] = useState();
  useEffect(() => {
    if (router.isReady) {
      setLeaveType(router.query.type);
    }
  }, [router.isReady, router.query.type]);

  const [dates, setDates] = useState([new Date()]);
  const date = new Date();
  let [Applyleavedates, SetApplyleavedates] = useState([]);
  let leavesdates = [];

  const today = new Date(date).toLocaleString("default", {
    month: "numeric",
    day: "2-digit",
    year: "numeric",
  });

  const tomorrow = new Date(date.setDate(date.getDate() + 1)).toLocaleString(
    "default",
    {
      month: "numeric",
      day: "2-digit",
      year: "numeric",
    }
  );

  const minLeaveNotice = addDays(new Date(), 7);

  const globalState = useSelector((state) => state.globalState);
  const [empData, setEmpData] = useState({});
  const [empRegData, setEmpRegData] = useState({});

  const [readonly, setreadonly] = useState(false);

  const [formData, setFormData] = useState({
    employee_id: globalState.Employee_id,
    from: globalState.email,
  });

  useEffect(() => {
    if (router.isReady) {
      setFormData({ ...formData, permission_type: leaveType });
    }
  }, [router.isReady, leaveType]);

  useEffect(() => {
    let leavedate;
    Applyleavedates.forEach((item, index) => {
      leavedate =
        Applyleavedates[index].month.name +
        " " +
        Applyleavedates[index].day +
        " " +
        Applyleavedates[index].year;
      leavesdates.push(leavedate);
    });

    if (leavesdates) {
      setFormData({
        ...formData,
        leavesdates,
      });
    }
  }, [Applyleavedates]);

  const formSubmit = (event) => {
    event.preventDefault();
    // console.log(formData);

    axios({
      method: "post",
      url: `${"/lettergenaration/"}`,
      data: formData,
    })
      .then(function (response) {
        console.log(response);
        event.target.reset();
        SetApplyleavedates([]);
        if (response.status === 200) {
          getUsersdata();
          toast.success("success", {
            theme: "colored",
          });

          const details = {
            type: "leave",
            message: `${globalState.user_name + " Has Applied For Leave"}`,
          };
          socket.emit("sendNotification", details);
        }
      })
      .catch(function (error) {
        toast.error("error");
      });
  };

  const getUsersdata = () => {
    axios({
      method: "get",
      url: `${"users/info/" + globalState.Employee_id}`,
      responseType: "stream",
    }).then(function (response) {
      setEmpData(response.data);
    });
  };

  useEffect(() => {
    getUsersdata();
  }, []);

  useEffect(() => {
    if (leaveType == "earlylogout") {
      setpage("early logout");
    } else if (leaveType == "latelogin") {
      setpage("late login");
    } else {
      setpage(leaveType);
    }
  }, [leaveType]);

  const getFormData = (event) => {
    setFormData({
      ...formData,
      [event?.target.name]: event?.target.value,
    });
  };

  return (
    <Box>
      <Container maxWidth={false}>
        <Box
          m={1}
          //margin
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <NextLink href={"./leaves?type=" + leaveType}>
            <Button variant="contained" color="primary" sx={{ height: 40 }}>
              {page} List
            </Button>
          </NextLink>
        </Box>
        <Card style={{ padding: "0px 80px", paddingBottom: "200px" }}>
          <Typography
            style={{ textTransform: "capitalize" }}
            variant="h4"
            raised
            sx={{ py: 4 }}
          >
            {page} Permission Letter
          </Typography>
          <form onSubmit={() => formSubmit(event)}>
            <Stack spacing={2}>
              <TextField
                disabled
                value={"From : " + empData.email}
                sx={{ width: "100%" }}
              />

              <TextField
                name="to"
                onChange={getFormData}
                required
                label="Send To"
                sx={{ width: "100%" }}
                select
              >
                <MenuItem value="hr">hr@exploreanddo.com</MenuItem>
                {/* <MenuItem value="admin">info@exploreanddo.com</MenuItem>
                <MenuItem value="both">
                  info@exploreanddo.com , hr@exploreanddo.com
                </MenuItem> */}
              </TextField>
              <TextField
                disabled
                value={"Date : " + fDate(new Date())}
                sx={{ width: "100%" }}
              />

              {leaveType == "leave" && (
                <Typography style={{ textTransform: "capitalize" }}>
                  I , <b>{empData?.firstName + " " + empData?.lastName}</b>{" "}
                  working in <b>{empData?.department}</b> want to seek leave
                  from
                  <DatePicker
                    required
                    onChange={SetApplyleavedates}
                    value={Applyleavedates}
                    minDate={addDays(new Date(), 7)}
                    format="MMMM DD YYYY"
                    label="Select Leave Dates"
                    sort
                    plugins={[<DatePanel />]}
                    style={{ zIndex: "1000" }}
                    name="leaves"
                  />
                </Typography>
              )}

              {(leaveType == "earlylogout" || leaveType == "latelogin") && (
                <Typography style={{ textTransform: "capitalize" }}>
                  I , <b>{empData?.firstName + " " + empData?.lastName}</b>{" "}
                  working in
                  <b> {empData?.department} </b> want {leaveType} Permission
                  <DatePicker
                    required
                    onChange={SetApplyleavedates}
                    value={Applyleavedates}
                    minDate={new Date(tomorrow)}
                    format="DD/MM/YYYY hh:mm:ss A"
                    sort
                    plugins={[<TimePicker position="bottom" />]}
                    style={{ zIndex: "1000" }}
                    name="leaves"
                  />
                </Typography>
              )}
              <TextField
                required
                lable="Reason"
                name="reason"
                multiline={true}
                minRows="4"
                defaultValue={empRegData?.reason}
                InputProps={{
                  readOnly: readonly,
                }}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    [event?.target.name]: event?.target.value,
                  });
                }}
              />
              <Stack
                direction="row"
                justifyContent="flex-end"
                sx={{ pr: 5, mr: 2 }}
                alignItems="center"
                spacing={2}
              >
                {(leaveType == "earlylogout" ||
                  leaveType == "latelogin" ||
                  leaveType == "leave") && (
                  <Button type="submit" variant="contained" disabled={readonly}>
                    Submit
                  </Button>
                )}
              </Stack>
            </Stack>
          </form>
        </Card>
      </Container>
      {ToastContainer_box}
    </Box>
  );
}
export default leave;
// leave.getLayout = (page) => <UserDashboardLayout>{page}</UserDashboardLayout>;

import { useState, useEffect } from "react";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import UserDashboardLayout from "@layouts/userdashboard";
import Page from "@components/Page";
import {
  Container,
  Box,
  TextField,
  Stack,
  Card,
  Typography,
} from "@mui/material";
import styles from "@styles/Users.module.css";
import { setDate } from "date-fns/esm";

export default function index() {
  const [editId, setEditId] = useState();
  const globalState = useSelector((state) => state.globalState);
  const [empData, setEmpData] = useState({});
  const [empRegData, setEmpRegData] = useState({});
  const [readonly, setreadonly] = useState(false);
  const [noticeDate, setnoticeDate] = useState(0);

  const getUsersdata = () => {
    axios({
      method: "get",
      url: `${"users/info/" + globalState.Employee_id}`,
      responseType: "stream",
    }).then(function (response: any) {
      setEmpData(response.data);
    });

    axios({
      method: "get",
      url: `${"exits/" + globalState.Employee_id}`,
      responseType: "stream",
    }).then(function (response: any) {
      setEmpRegData(response.data[0]);
      if (response.data[0]?.reason) {
        setreadonly(true);
      }
    });
  };

  useEffect(() => {
    getUsersdata();
  }, []);

  const date = new Date();

  const today = new Date(date).toLocaleString("default", {
    month: "numeric",
    day: "2-digit",
    year: "numeric",
  });

  const notice = new Date(
    date.setDate(date.getDate() + parseInt(empData.noticePeriod))
  ).toLocaleString("default", {
    month: "numeric",
    day: "2-digit",
    year: "numeric",
  });

  const [formData, setFormData] = useState({
    employee_id: globalState.Employee_id,
    start_date: today,
    created_at: today,
  });

  useEffect(() => {
    setFormData({ ...formData, end_date: notice });
  }, [empData]);

  const formSubmit = (event: Event) => {
    event.preventDefault();
    console.log(formData);
    axios({
      method: "post",
      url: `${"/exits/"}`,
      data: formData,
    })
      .then(function (response: any) {
        event.target.reset();
        if (response.status === 200) {
          getUsersdata();
          toast.success("success", {
            theme: "colored",
          });
        }
      })
      .catch(function (error: any) {
        toast.error("error");
      });
  };

  return (
    <Page title="User Exit || E&D 360" role="user">
      <Container>
        <Card sx={{ p: 5 }}>
          <Typography variant="h4" sx={{ py: 4 }}>
            Resignation Letter
          </Typography>
          <Typography>
            I , <b>{empData.firstName + " " + empData.lastName}</b> ,am
            resigning from my position as a <b>{empData.department}</b> with e&d
            on <b>{today}</b> and my notice period ends on <b>{notice}</b> days
            the reason for my resigning is
          </Typography>

          <form onSubmit={() => formSubmit(event)}>
            <TextField
              required
              name="reason"
              className={styles.taskInputField}
              multiline="true"
              minRows="4"
              defaultValue={empRegData?.reason}
              InputProps={{
                readOnly: readonly,
              }}
              onChange={(event: any) => {
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
              <Button type="submit" variant="contained" disabled={readonly}>
                Submit
              </Button>
            </Stack>
          </form>
        </Card>
      </Container>
      {ToastContainer_box}
    </Page>
  );
}
// index.getLayout = (page) => <UserDashboardLayout>{page}</UserDashboardLayout>;

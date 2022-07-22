import {
  Typography,
  Container,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Switch,
  Button,
  Breadcrumbs,
  Stack,
  Drawer,
  Box,
} from "@mui/material";
import styles from "@styles/Users.module.css";
import { useState, useEffect } from "react";
import Sidemenu from "./Sidemenu";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import moment from "moment";
function Compensation(props) {
  const [anchor, setanchor] = useState(false);
  const [compensation, setCompensation] = useState([]);
  const globalState = useSelector((state) => state.globalState);
  const [currentCtc, setcurrentCtc] = useState(props.data.compensation);
  const [ctc, setCtc] = useState(props.data.compensation);
  const [formData, setformData] = useState({
    employee_id: props.menu.employee_id,
  });
  const getFormData = (event: any) => {
    setformData({ ...formData, [event.target.name]: event.target.value });
    if (event.target.name == "percentage") {
      var updateCtc =
        parseInt(ctc) + parseInt((event.target.value / 100) * ctc);
      setcurrentCtc(updateCtc);
      setformData({
        ...formData,
        current_ctc: updateCtc.toString(),
        previous_ctc: ctc,
        percentage: event.target.value,
      });
    }
  };

  const submitFormData = (event) => {
    event.preventDefault();
    console.log(formData);
    axios({
      method: "post",
      url: `${"/compensation/"}`,
      data: formData,
    })
      .then(function (response: { status: number }) {
        event.target.reset();
        if (response.status === 200) {
          getCompensation();
          toast.success("success", {
            theme: "colored",
          });
        }
      })
      .catch(function (error: any) {
        toast.error("error");
      });
    // updateStatus(formData);
  };

  const getCompensation = () => {
    // const formBindData = new FormData();
    // formBindData.append("employee_id", "ED1250");
    axios({
      method: "get",
      url: `${"/compensation/" + props.menu.employee_id}`,
    }).then(function (response) {
      setCompensation(response.data);

      if (response.data.length >= 1) {
        setcurrentCtc(response.data[0].current_ctc);
        setCtc(response.data[0].current_ctc);
      }
    });
  };
  useEffect(() => {
    getCompensation();
  }, []);

  const data = compensation.map((item, index) => {
    return (
      <tr>
        <td>
          {moment(compensation[index].date_of_discussion)
            .utc()
            .format("DD-MM-YYYY")}
        </td>
        <td>
          {moment(compensation[index].date_of_implementation)
            .utc()
            .format("DD-MM-YYYY")}
        </td>
        <td>{compensation[index].current_ctc}</td>
        <td>{compensation[index].percentage}</td>
      </tr>
    );
  });

  return (
    <div>
      {" "}
      <Grid container spacing={2}>
        <Sidemenu data={props.menu} />

        <Grid item xs={12} lg={9} md={7}>
          <Typography sx={{ my: 4 }} variant="h4">
            Compensation Table{" "}
            {props.menu.role != "user" && (
              <Button
                sx={{ ml: 5 }}
                variant="contained"
                onClick={() => setanchor(true)}
              >
                <AddIcon />
                Compensation
              </Button>
            )}
          </Typography>
          <div>
            <table className="compensation">
              <tr>
                <th>Date Of Discussion</th>
                <th>Date Of Implementation</th>
                <th>Amount CTC</th>
                <th>Percentage %</th>
              </tr>
              {data}
            </table>
          </div>
          <Typography sx={{ my: 4 }} variant="h4">
            Started On {props.data.doj} INR {props.data.compensation}
          </Typography>
        </Grid>
      </Grid>
      <Drawer anchor="right" open={anchor} onClose={() => setanchor(false)}>
        <form onSubmit={submitFormData}>
          <Box sx={{ width: 450, mt: 5 }}>
            <Typography variant="h4">Update Compensation</Typography>
            <TextField
              required
              helperText="Date Of Discussion"
              name="date_of_discussion"
              type="date"
              className={styles.taskInputField}
              onChange={getFormData}
            />

            <TextField
              required
              helperText="Date Of Implementation"
              name="date_of_implementation"
              className={styles.taskInputField}
              onChange={getFormData}
              type="date"
            />

            <TextField
              required
              label="Amount"
              name="current_ctc"
              value={currentCtc}
              className={styles.taskInputField}
              onChange={getFormData}
            />

            <TextField
              required
              label="Percentage %"
              name="percentage"
              className={styles.taskInputField}
              onChange={getFormData}
            />

            <Stack direction="row" spacing={2} sx={{ mx: 3 }}>
              <Button type="reset" variant="contained" color="info">
                Reset
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Update
              </Button>
            </Stack>
          </Box>
        </form>
      </Drawer>
    </div>
  );
}

export default Compensation;

import { useState, React, useEffect } from "react";
import UserDashboardLayout from "@layouts/userdashboard";
import Page from "@components/Page";
import styles from "@styles/Users.module.css";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import {
  Typography,
  Container,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
const checklist = () => {
  const globalState = useSelector((state) => state.globalState);
  const [formData, setformData] = useState({
    employee_id: globalState.Employee_id,
  });

  const [readonly, setreadnly] = useState(false);

  const getFormData = (event) => {
    setformData({ ...formData, [event.target.name]: event.target.checked });
  };

  const submitFeedback = (event) => {
    event.preventDefault();
    axios({
      method: "post",
      url: `${"/exits/checklists"}`,
      data: formData,
    })
      .then(function (response) {
        event.target.reset();
        console.log(response);
        if (response.status === 200) {
          getFeedBackData();
          updateStatus("send_check_list", "completed");
        }
      })
      .catch(function (error) {
        toast.error("error");
      });
  };

  const updateStatus = (field, value) => {
    axios({
      method: "put",
      url: `${"/exits/" + globalState.Employee_id}`,
      data: {
        [`${field}`]: value,
      },
    }).then(function (response) {
      if (response.status === 200) {
        toast.success("success", {
          theme: "colored",
        });
      }
    });
  };

  const getFeedBackData = () => {
    axios({
      method: "get",
      url: `${"/exits/checklists/" + globalState.Employee_id}`,
    })
      .then(function (response) {
        if (response.data) {
          setformData(response.data);
          setreadnly(true);
        }
      })
      .catch(function (error) {
        toast.error("error");
      });
  };

  useEffect(() => {
    getFeedBackData();
  }, []);

  console.log(formData);

  const checked = () => {
    return false;
  };

  return (
    <Page title="Feedback">
      <form onSubmit={submitFeedback}>
        <Container>
          <Typography variant="h3" sx={{ my: 3 }}>
            Check List.
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox />}
              name="id_card"
              label="ID Card"
              onChange={getFormData}
              checked={Boolean(formData?.id_card)}
              disabled={readonly}
            />
            <FormControlLabel
              control={<Checkbox />}
              name="cell_phone"
              label="Cell Phone"
              onChange={getFormData}
              checked={Boolean(formData?.cell_phone)}
              disabled={readonly}
            />
            <FormControlLabel
              control={<Checkbox />}
              name="laptop"
              label="Laptop"
              onChange={getFormData}
              checked={Boolean(formData?.laptop)}
              disabled={readonly}
            />
            <FormControlLabel
              control={<Checkbox />}
              name="key_s"
              label="Keys"
              onChange={getFormData}
              checked={Boolean(formData?.key_s)}
              disabled={readonly}
            />
            <FormControlLabel
              control={<Checkbox />}
              name="files"
              label="Files"
              onChange={getFormData}
              checked={Boolean(formData?.files)}
              disabled={readonly}
            />
          </FormGroup>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={3}
          >
            <Button type="submit" variant="contained" disabled={readonly}>
              Submit
            </Button>
            <Button type="reset" variant="contained" color="secondary">
              Reset
            </Button>
          </Stack>
        </Container>
      </form>
      {ToastContainer_box}
    </Page>
  );
};
export default checklist;
// checklist.getLayout = (page) => (
//   <UserDashboardLayout>{page}</UserDashboardLayout>
// );

import { useState, React, useEffect } from "react";
import DashboardLayout from "@layouts/dashboard";
import Page from "@components/Page";
import styles from "@styles/Users.module.css";
import { useRouter } from "next/router";
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
} from "@mui/material";
const feedback = () => {
  const router = useRouter();
  const globalState = useSelector((state) => state.globalState);
  const [formData, setformData] = useState();

  useEffect(() => {
    if (router.isReady) {
      setformData({
        employee_id: router.query.empId,
        status: "send",
      });
    }
  }, [router.isReady]);

  const [readonly, setreadnly] = useState(false);

  const getFormData = (event) => {
    setformData({ ...formData, [event.target.name]: event.target.value });
  };

  const submitFeedback = (event) => {
    event.preventDefault();
    axios({
      method: "post",
      url: `${"/exits/feedback"}`,
      data: formData,
    })
      .then(function (response) {
        event.target.reset();
        if (response.status === 200) {
          getFeedBackData();
          toast.success("success", {
            theme: "colored",
          });
        }
      })
      .catch(function (error) {
        toast.error("error");
      });
  };

  const getFeedBackData = () => {
    axios({
      method: "get",
      url: `${"/exits/feedback/" + router.query.empId}`,
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
    if (router.isReady) {
      getFeedBackData();
    }
  }, [router.isReady]);

  return (
    <Page title="Feedback">
      <form onSubmit={submitFeedback}>
        <Container>
          <Typography variant="h3">Feed Back</Typography>
          <TextField
            required
            label="Do you have any Suggestions on how to make the work environment more fun ?"
            sx={{ m: 3, width: "100%" }}
            multiline
            rows={4}
            name="fed_question_1"
            onChange={getFormData}
            defaultValue={formData?.fed_question_1}
            InputProps={{
              readOnly: readonly,
            }}
          />

          <TextField
            required
            label="Are you having any issue your jon in your current position if yes,pls explan"
            sx={{ m: 3, width: "100%" }}
            multiline
            rows={4}
            name="fed_question_2"
            onChange={getFormData}
            value={formData?.fed_question_2}
            InputProps={{
              readOnly: readonly,
            }}
          />

          <TextField
            required
            label="please provide any suggestion/feedback that will help to make you job resposibility better"
            sx={{ m: 3, width: "100%" }}
            multiline
            rows={4}
            name="fed_question_3"
            onChange={getFormData}
            value={formData?.fed_question_3}
            InputProps={{
              readOnly: readonly,
            }}
          />

          <TextField
            required
            label="Is there any work style/culture you don't like in the company"
            sx={{ m: 3, width: "100%" }}
            multiline
            rows={4}
            name="fed_question_4"
            onChange={getFormData}
            value={formData?.fed_question_4}
            InputProps={{
              readOnly: readonly,
            }}
          />

          <TextField
            required
            label="Do you have any idea on how you would like to be for a job done well ?"
            sx={{ m: 3, width: "100%" }}
            multiline
            rows={4}
            name="fed_question_5"
            onChange={getFormData}
            value={formData?.fed_question_5}
            InputProps={{
              readOnly: readonly,
            }}
          />

          <TextField
            required
            label="Are there things you wish you done better"
            sx={{ m: 3, width: "100%" }}
            multiline
            rows={4}
            name="fed_question_6"
            onChange={getFormData}
            value={formData?.fed_question_6}
            InputProps={{
              readOnly: readonly,
            }}
          />

          <TextField
            required
            label="In team of income salary compesation and benefits you satisfied it ?"
            sx={{ m: 3, width: "100%" }}
            multiline
            rows={4}
            name="fed_question_7"
            onChange={getFormData}
            value={formData?.fed_question_7}
            InputProps={{
              readOnly: readonly,
            }}
          />

          <TextField
            required
            label="How would you rate the leadership of you current manager ?"
            sx={{ m: 3, width: "100%" }}
            multiline
            rows={4}
            name="fed_question_8"
            onChange={getFormData}
            value={formData?.fed_question_8}
            InputProps={{
              readOnly: readonly,
            }}
          />

          <TextField
            required
            label="Is you manager able to delegate resposibility /teams properly ?"
            sx={{ m: 3, width: "100%" }}
            multiline
            rows={4}
            name="fed_question_9"
            onChange={getFormData}
            value={formData?.fed_question_9}
            InputProps={{
              readOnly: readonly,
            }}
          />

          <TextField
            required
            label="Does your manager motivate you in performing effectively in your job ?"
            sx={{ m: 3, width: "100%" }}
            multiline
            rows={4}
            name="fed_question_10"
            onChange={getFormData}
            value={formData?.fed_question_10}
            InputProps={{
              readOnly: readonly,
            }}
          />
          <TextField
            required
            label="Comment,Feedback/Suggestions"
            sx={{ m: 3, width: "100%" }}
            multiline
            rows={4}
            name="fed_question_11"
            onChange={getFormData}
            value={formData?.fed_question_11}
            InputProps={{
              readOnly: readonly,
            }}
          />

          {/* <Stack
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
          </Stack> */}
        </Container>
      </form>
      {ToastContainer_box}
    </Page>
  );
};
export default feedback;
// feedback.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

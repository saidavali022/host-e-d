import { useState, useEffect } from "react";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import DashboardLayout from "@layouts/hrdashboard";
import NextLink from "next/link";
import { CKEditor } from "ckeditor4-react";
import {
  Container,
  Box,
  TextField,
  Stack,
  Card,
  Typography,
} from "@mui/material";
import styles from "@styles/Users.module.css";
import { NextRouter, useRouter } from "next/router";

function letter() {
  const router: NextRouter = useRouter();
  const [leaveType, setLeaveType] = useState();
  type formData = {
    employee_id: string;
    letter_type: string;
    uploaded_file: string;
  };
  type globalState = {
    globalState: {
      employee_id: string;
    };
  };
  const globalState = useSelector((state: globalState) => state.globalState);
  const [formData, setFormData]: formData = useState();
  useEffect(() => {
    if (router.isReady) {
      setLeaveType(router.query.type);
    }
  }, [router.isReady, router.query.type]);

  const formSubmit = (event: Event) => {
    event.preventDefault();
    const formBindData = new FormData();
    formBindData.append("employee_id", formData.employee_id);
    formBindData.append("letter_type", formData.letter_type);
    formBindData.append("uploaded_file", formData.uploaded_file);
    axios({
      method: "post",
      url: `${"/lettergenaration/letters"}`,
      data: formBindData,
    })
      .then(function (response: { status: number }) {
        event.target.reset();
        if (response.status === 200) {
          toast.success("success", {
            theme: "colored",
          });
        }
      })
      .catch(function (error: any) {
        toast.error("error");
      });
  };

  useEffect(() => {
    if (router.isReady) {
      setFormData({ ...formData, letter_type: leaveType });
    }
  }, [router.isReady, leaveType]);
  const initialValue =
    "<p>Your initial <b>html value</b> or an empty string to init editor without value</p>";
  const [value, onChange] = useState(initialValue);

  return (
    <Box sx={{ width: "85%", flexGrow: 1 }}>
      <Container>
        {/* <PDFDownloadLink document={<Pdfdata />} fileName="somename.pdf">
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Download now!"
          }
        </PDFDownloadLink> */}
        <Box
          m={1}
          //margin
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <NextLink href={"./list?type=" + leaveType}>
            <Button variant="contained" color="primary" sx={{ height: 40 }}>
              {leaveType} List
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
            {leaveType + " "} Letter
          </Typography>

          <form onSubmit={() => formSubmit(event)}>
            <TextField
              label="Emmploye Id"
              required
              name="employee_id"
              type="text"
              className={styles.taskInputField}
              onChange={(event) => {
                setFormData({
                  ...formData,
                  [event?.target.name]: event.target.value,
                });
              }}
            />

            <TextField
              required
              name="uploaded_file"
              type="file"
              className={styles.taskInputField}
              onChange={(event) => {
                setFormData({
                  ...formData,
                  [event?.target.name]: event.target.files[0],
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
              {(leaveType == "offer" ||
                leaveType == "probation" ||
                leaveType == "increment" ||
                leaveType == "relieving" ||
                leaveType == "exprience" ||
                leaveType == "others") && (
                <Button type="submit" variant="contained">
                  Submit
                </Button>
              )}
            </Stack>
          </form>
        </Card>
      </Container>
      {ToastContainer_box}
    </Box>
  );
}
export default letter;
// letter.getLayout = (page: String) => <DashboardLayout>{page}</DashboardLayout>;

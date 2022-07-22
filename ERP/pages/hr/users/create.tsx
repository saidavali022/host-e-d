import Page from "@components/Page";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
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
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "@styles/Users.module.css";
import Policies_procedures from "pages/components/Policies_procedures";
import * as React from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import DashboardLayout from "@layouts/hrdashboard";
import "react-toastify/dist/ReactToastify.css";
import axios from "@utils/defaultImports";
const label = { inputProps: "aria-label" };
export default function create() {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");
  const [formData, setformData] = useState({});

  const [openButton, setopenButton] = useState(true);

  const [Gender, setGender] = React.useState();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };
  const [Maritial, setMaritial] = React.useState();
  const MaritialhandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaritial(event.target.value);
  };
  const [BloodGroup, setBloodGroup] = React.useState();
  const BloodGroupHandlechange = (even: any) => {
    setBloodGroup(event.target.value);
  };

  const BloodGroups = [
    "A",
    "B",
    "O",
    "A+",
    "A-",
    "B+",
    "B-",
    "O+",
    "O-",
    "AB+",
    "AB-",
  ];

  const getFormData = (event: any) => {
    if (event.target.type == "file") {
      setformData({
        ...formData,
        [event.target.name]: event.target.files[0],
      });
    } else {
      setformData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  const formSubmit = (event: any) => {
    event.preventDefault();
    const formBindData = new FormData();
    // formBindData.append("first_name", formData.first_name);
    for (var key in formData) {
      // console.log(key + " - " + formData[key]);
      formBindData.append([key], formData[key]);
    }
    // console.log(formBindData);
    // const formBindData = new FormData();
    // formBindData.append("first_name", formData.first_name);

    axios({
      method: "post",
      url: "/users/",
      data: formBindData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response: any) {
        console.log(response);
        event.target.reset();
        if (response.status === 200) {
          toast.success("success", {
            theme: "colored",
          });
        }
      })
      .catch(function (error: any) {
        console.log(error);
        toast.error("error");
      });
  };

  const getChechBox = (event) => {
    if (event.target.checked) {
      setOpen(true);
    }
  };

  return (
    <>
      <Page title="E&D 360 | Create User">
        <Container maxWidth={false}>
          <form onSubmit={formSubmit}>
            <Grid container spacing={2} sx={{ my: 4 }}>
              <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mx: "auto" }}>
                <div>
                  <Typography variant="h4"> Personal Details </Typography>

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    label="Username"
                    onChange={getFormData}
                    name="username"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="First Name"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="firstName"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Last Name"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="lastName"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Father Name"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="fatherName"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Mother Name"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="motherName"
                  />
                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Email"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="email"
                    type="email"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    type="number"
                    label="Phone"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="phone"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Gender"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="gender"
                    select
                  >
                    {["Male", "Female", "Other"].map((item) => {
                      return <MenuItem value={item}>{item}</MenuItem>;
                    })}
                  </TextField>
                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Guardian Phone"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="guardianPhone"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="Dob"
                    type="date"
                    helperText="Date Of Birth"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="Doj"
                    type="date"
                    helperText="Date Of Joining"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Blood Group"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="blood_group"
                    select
                  >
                    {BloodGroups.map((item, index) => {
                      return <MenuItem value={item}>{item}</MenuItem>;
                    })}
                  </TextField>

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="House No"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="houseNo"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Street"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="street"
                  />
                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="City"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="city"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="State"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="state"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Country"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="country"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Nationality"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="nationality"
                  />
                  <Typography variant="h4">Government Id </Typography>
                  <TextField
                    className={styles.userCreateForm}
                    required
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="aadhar"
                    type="file"
                    helperText="Aadhar (PDF)"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Aadhar No"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="aadharNo"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="panCard"
                    type="file"
                    helperText="Pan Card (PDF)"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="PanCard No"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="panCardNo"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="passportSizePhoto"
                    type="file"
                    helperText="Passport Size Photo (png)"
                    inputProps={{ accept: "image/png" }}
                  />

                  <Typography variant="h4">Educational Details </Typography>

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    label="Highest Qualification"
                    onChange={getFormData}
                    name="highestQualification"
                    select
                  >
                    <MenuItem value="ssc">ssc</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="diploma">Diploma</MenuItem>
                    <MenuItem value="degree">Degree</MenuItem>
                    <MenuItem value="graduation">Graduate</MenuItem>
                    <MenuItem value="post graduation">Post Graduation</MenuItem>
                  </TextField>

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="SSC"
                    helperText="SSC certificate (PDF)"
                    type="file"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="intermediate"
                    type="file"
                    helperText="Intermediate certificate (PDF)"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="diploma"
                    type="file"
                    helperText="Diploma certificate (PDF)"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="bachelor"
                    type="file"
                    helperText="Bachelor certificate (PDF)"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="master"
                    type="file"
                    helperText="Master certificate (PDF)"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="marksMemo"
                    type="file"
                    helperText="Marks Memo certificate (PDF)"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="TC"
                    type="file"
                    helperText="TC (PDF)"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="passoutYear"
                    label="Passout Year"
                    helperText="If Completed Graduation/Master Else 0"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Expected Passout Year"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="Expected Passout Year"
                    helperText="If pursuing else 0"
                  ></TextField>

                  <Typography variant="h4">Bank Details </Typography>

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Bank Account No"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="bankAccountNo"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="IFSC Code"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="IFSCCode"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Account Holder Name"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="accountHolderName"
                  />
                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Bank Name"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="BankName"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="Branch Name"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="BranchName"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    required
                    label="UPI Id"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="UPIId"
                  />

                  <Typography variant="h4">
                    Previous Employment Details (If any)
                  </Typography>

                  <TextField
                    className={styles.userCreateForm}
                    helperText="Offer Letter (PDF)"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="offerLetter"
                    type="file"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    helperText="Experience Certificate (PDF)"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="experienceCertificate"
                    type="file"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    helperText="Increment Letter (PDF)"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="incrementLetter"
                    type="file"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    helperText="Payslips (PDF)"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="payslips"
                    type="file"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    helperText="Resignation Letter"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="resignationLette"
                    type="file"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <Typography variant="h4">Social Id's</Typography>
                  <TextField
                    className={styles.userCreateForm}
                    label="LinkedIn Profile Link"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="linkedInProfileLink"
                  />
                  <TextField
                    className={styles.userCreateForm}
                    label="Facebook Profile Link"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="facebookProfileLink"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Instagram Profile Link"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="InstagramProfileLink"
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Twitter Profile Link"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="Twitter Profile Link"
                  />
                </div>
                <FormControlLabel
                  control={<Checkbox />}
                  label=" I hereby declare that I agree to policies respect the confidentiality of the work at Explore and Do Technologies Pvt. Ltd"
                  labelPlacement="end"
                  onChange={getChechBox}
                  disabled={!openButton}
                />
                <div
                  style={{
                    textAlign: "center",
                    marginLeft: "auto",
                    marginTop: "30px",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{ mx: 2 }}
                    type="reset"
                    color="secondary"
                  >
                    Reset
                  </Button>

                  <Button
                    type="submit"
                    disabled={openButton}
                    variant="contained"
                    sx={{ mx: 2 }}
                  >
                    Submit
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>

          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            scroll={scroll}
          >
            <DialogTitle id="scroll-dialog-title">
              Explore And Do Technologies Pvt. Ltd..{" "}
            </DialogTitle>
            <DialogContent dividers={scroll === "paper"}>
              <DialogContentText tabIndex={-1}>
                <Policies_procedures />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  setOpen(false);
                  setopenButton(false);
                }}
              >
                Accept
              </Button>
            </DialogActions>
          </Dialog>

          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Container>
      </Page>
    </>
  );
}

// create.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

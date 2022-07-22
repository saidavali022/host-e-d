import Page from "@components/Page";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import parse from "html-react-parser";
import moment from "moment";
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
  FormHelperText,
} from "@mui/material";

import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "@styles/Users.module.css";
import Policies_procedures from "pages/components/Policies_procedures";
import * as React from "react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import NextLink from "next/link";
import axios from "@utils/defaultImports";
export default function edit() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
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
  const router = useRouter();
  const [id, setid] = useState();
  const [userData, setuserData] = useState<any>({});
  useEffect(() => {
    if (router.isReady) {
      setid(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const getUserData = () => {
    axios({
      method: "get",
      url: `${"users/data/" + id}`,
      responseType: "stream",
    }).then(function (response) {
      if (response.data.id) {
        setuserData(response.data);
        // console.log(response.data);
      } else {
        router.push("./");
      }
    });
  };

  useEffect(() => {
    if (id) {
      getUserData();
    }
  }, [id]);

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
      setuserData({
        ...userData,
        [event.target.name]: event.target.files[0],
      });
    } else {
      setuserData({ ...userData, [event.target.name]: event.target.value });
    }
  };

  const formSubmit = (event: any) => {
    event.preventDefault();
    const formBindData = new FormData();
    setLoading(true);
    // formBindData.append("first_name", formData.first_name);
    for (var key in userData) {
      console.log(key + " - " + userData[key]);
      formBindData.append([key], userData[key]);
    }
    // console.log(formBindData);
    // const formBindData = new FormData();
    // formBindData.append("first_name", formData.first_name);

    axios({
      method: "put",
      url: "/users/" + id,
      data: formBindData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response: any) {
        console.log(response);
        event.target.reset();
        if (response.status === 200) {
          getUserData();
          setTimeout(function () {
            setLoading(false);
          }, 400);
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
        <Container>
          <form onSubmit={formSubmit}>
            <Grid container spacing={2} sx={{ my: 4 }}>
              <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mx: "auto" }}>
                <div>
                  <Typography variant="h4"> Personal Details </Typography>
                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    label="User Name"
                    onChange={getFormData}
                    name="username"
                    value={userData?.username}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="First Name"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="firstName"
                    value={userData?.firstName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Last Name"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="lastName"
                    value={userData?.lastName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Father Name"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="fatherName"
                    value={userData?.fatherName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Mother Name"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="motherName"
                    value={userData?.motherName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    className={styles.userCreateForm}
                    label="Email"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="email"
                    type="email"
                    value={userData?.email}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    type="number"
                    label="Phone"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="phone"
                    value={userData?.phone}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Gender"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="gender"
                    select
                    helperText={userData?.gender}
                  >
                    {["Male", "Female", "Other"].map((item) => {
                      return <MenuItem value={item}>{item}</MenuItem>;
                    })}
                  </TextField>
                  <TextField
                    className={styles.userCreateForm}
                    label="Guardian Phone"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="guardianPhone"
                    value={userData?.guardianPhone}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="Dob"
                    type="date"
                    helperText={
                      "Date Of Birth " +
                      moment(userData?.Dob).utc().format("DD-MM-YYYY")
                    }
                    value={userData?.Dob}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="Doj"
                    type="date"
                    helperText={
                      "Date Of Joining " +
                      moment(userData?.Doj).utc().format("DD-MM-YYYY")
                    }
                    value={userData?.Doj}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Blood Group"
                    sx={{ m: 3, textTransform: "capitalize" }}
                    onChange={getFormData}
                    name="blood_group"
                    select
                    helperText={userData?.blood_group}
                  >
                    {BloodGroups.map((item, index) => {
                      return (
                        <MenuItem
                          sx={{ textTransform: "capitalize" }}
                          value={item}
                        >
                          {item}
                        </MenuItem>
                      );
                    })}
                  </TextField>

                  <TextField
                    className={styles.userCreateForm}
                    label="House No"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="houseNo"
                    value={userData?.houseNo}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Street"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="street"
                    value={userData?.street}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    className={styles.userCreateForm}
                    label="City"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="city"
                    value={userData?.city}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="State"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="state"
                    value={userData?.state}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Country"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="country"
                    value={userData?.country}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Nationality"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="nationality"
                    value={userData?.nationality}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <Typography variant="h4">Government Id </Typography>
                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="aadhar"
                    type="file"
                    helperText={parse(
                      "<a target='_blank' href=" +
                        process.env.NEXT_PUBLIC_HOST +
                        "/" +
                        userData?.aadhar +
                        ">Aadhar View</a>"
                    )}
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Aadhar No"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="aadharNo"
                    value={userData?.aadharNo}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="panCard"
                    type="file"
                    helperText={parse(
                      "<a target='_blank' href=" +
                        process.env.NEXT_PUBLIC_HOST +
                        "/" +
                        userData?.panCard +
                        ">Pan Card View</a>"
                    )}
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="PanCard No"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="panCardNo"
                    value={userData?.panCardNo}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="passportSizePhoto"
                    type="file"
                    helperText={parse(
                      "<a target='_blank' href=" +
                        process.env.NEXT_PUBLIC_HOST +
                        "/" +
                        userData?.passportSizePhoto +
                        ">Passport Size Photo View</a>"
                    )}
                    inputProps={{ accept: "image/png" }}
                  />

                  <Typography variant="h4">Educational Details </Typography>

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    label="Highest Qualification"
                    onChange={getFormData}
                    name="highestQualification"
                    helperText={userData?.highestQualification}
                    select
                    value={userData?.highestQualification}
                  >
                    <MenuItem value="ssc">ssc</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="diploma">Diploma</MenuItem>
                    <MenuItem value="graduation">Graduate</MenuItem>
                    <MenuItem value="post graduation">Post Graduation</MenuItem>
                  </TextField>

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="SSC"
                    type="file"
                    helperText={parse(
                      "<a target='_blank' href=" +
                        process.env.NEXT_PUBLIC_HOST +
                        "/" +
                        userData?.SSC +
                        ">SSC certificate View</a>"
                    )}
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="intermediate"
                    type="file"
                    helperText={parse(
                      "<a target='_blank' href=" +
                        process.env.NEXT_PUBLIC_HOST +
                        "/" +
                        userData?.intermediate +
                        ">Intermediate certificate (PDF) View</a>"
                    )}
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="diploma"
                    type="file"
                    helperText={parse(
                      "<a target='_blank' href=" +
                        process.env.NEXT_PUBLIC_HOST +
                        "/" +
                        userData?.diploma +
                        ">Diploma certificate (PDF) View</a>"
                    )}
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="bachelor"
                    type="file"
                    helperText={parse(
                      "<a target='_blank' href=" +
                        process.env.NEXT_PUBLIC_HOST +
                        "/" +
                        userData?.bachelor +
                        ">Bachelor certificate (PDF) View</a>"
                    )}
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="master"
                    type="file"
                    inputProps={{ accept: "application/pdf" }}
                    helperText={parse(
                      "<a target='_blank' href=" +
                        process.env.NEXT_PUBLIC_HOST +
                        "/" +
                        userData?.master +
                        ">Master certificate (PDF) View</a>"
                    )}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="marksMemo"
                    type="file"
                    helperText={parse(
                      "<a target='_blank' href=" +
                        process.env.NEXT_PUBLIC_HOST +
                        "/" +
                        userData?.marksMemo +
                        ">Marks Memo certificate (PDF) View</a>"
                    )}
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="TC"
                    type="file"
                    helperText={parse(
                      "<a target='_blank' href=" +
                        process.env.NEXT_PUBLIC_HOST +
                        "/" +
                        userData?.TC +
                        ">TC (PDF) View</a>"
                    )}
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="passoutYear"
                    label="Passout Year"
                    helperText="If Completed Graduation/Master Else 0"
                    value={userData?.passoutYear}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Expected Passout Year"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="expectedPassoutYear"
                    helperText="If pursuing else 0"
                    value={userData?.expectedPassoutYear}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  ></TextField>

                  <Typography variant="h4">Bank Details </Typography>

                  <TextField
                    className={styles.userCreateForm}
                    label="Bank Account No"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="bankAccountNo"
                    value={userData?.bankAccountNo}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="IFSC Code"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="IFSCCode"
                    value={userData?.IFSCCode}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Account Holder Name"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="accountHolderName"
                    value={userData?.accountHolderName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    className={styles.userCreateForm}
                    label="Bank Name"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="BankName"
                    value={userData?.BankName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Branch Name"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="BranchName"
                    value={userData?.BranchName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="UPI Id"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="UPIId"
                    value={userData?.UPIId}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <Typography variant="h4">
                    Previous Employment Details (If any)
                  </Typography>

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="offerLetter"
                    type="file"
                    helperText={parse(
                      "<a target='_blank' href=" +
                        process.env.NEXT_PUBLIC_HOST +
                        "/" +
                        userData?.offerLetter +
                        ">Offer Letter (PDF) View</a>"
                    )}
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    helperText={parse(
                      "<a target='_blank' href=" +
                        process.env.NEXT_PUBLIC_HOST +
                        "/" +
                        userData?.experienceCertificate +
                        ">Experience Certificate (PDF) View</a>"
                    )}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="experienceCertificate"
                    type="file"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    helperText={parse(
                      "<a target='_blank' href=" +
                        process.env.NEXT_PUBLIC_HOST +
                        "/" +
                        userData?.incrementLetter +
                        ">Increment Letter (PDF) View</a>"
                    )}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="incrementLetter"
                    type="file"
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="payslips"
                    type="file"
                    helperText={parse(
                      "<a target='_blank' href=" +
                        process.env.NEXT_PUBLIC_HOST +
                        "/" +
                        userData?.payslips +
                        ">Payslips (PDF) View</a>"
                    )}
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="resignationLette"
                    type="file"
                    helperText={parse(
                      "<a target='_blank' href=" +
                        process.env.NEXT_PUBLIC_HOST +
                        "/" +
                        userData?.resignationLette +
                        ">Resignation Letter View</a>"
                    )}
                    inputProps={{ accept: "application/pdf" }}
                  />

                  <Typography variant="h4">Social Id's</Typography>
                  <TextField
                    className={styles.userCreateForm}
                    label="LinkedIn Profile Link"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="linkedInProfileLink"
                    value={userData?.linkedInProfileLink}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    className={styles.userCreateForm}
                    label="Facebook Profile Link"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="facebookProfileLink"
                    value={userData?.facebookProfileLink}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Instagram Profile Link"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="instagramProfileLink"
                    value={userData?.instagramProfileLink}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    className={styles.userCreateForm}
                    label="Twitter Profile Link"
                    sx={{ m: 3 }}
                    onChange={getFormData}
                    name="twitterProfileLink"
                    value={userData?.twitterProfileLink}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

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

                  {/* <Button>
                    Save
                  </Button> */}
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    sx={{ mx: 2 }}
                    loading={loading}
                    loadingPosition="end"
                    endIcon={<SaveIcon />}
                  >
                    Save
                  </LoadingButton>
                </div>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Page>
    </>
  );
}

// create.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

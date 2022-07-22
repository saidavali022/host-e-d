import React from "react";
import NextLink from "next/link";
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
} from "@mui/material";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Personal from "./Personal";
import Bankdetails from "./Bankdetails";
import Documents from "./Documents";
import Compensation from "./Compensation";
import moment from "moment";
import { fDate } from "@utils/formatTime";
import { useEffect } from "react";
const Index = ({ userData, role, lettersData }) => {
  const [value, setValue] = React.useState("1");
  const [personalData, setpersonalData] = React.useState();
  const [bankdetails, setbankdetails] = React.useState();
  const [sideMenuData, setsideMenuData] = React.useState();
  const [documents, setdocuments] = React.useState({});
  const [compensation, setcompensation] = React.useState({});

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (userData.id) {
      setpersonalData({
        first_Name: userData.firstName,
        last_Name: userData.lastName,
        father_Name: userData.fatherName,
        mother_Name: userData.motherName,
        highest_Qualification: userData.highestQualification,
        Doj: fDate(userData.Doj),
        Dob: fDate(userData.Dob),
        email: userData.email,
        phone: userData.phone,
        guardian_Phone: userData.guardianPhone,
        gender: userData?.gender,
        blood_group: userData.blood_group,
        house_No: userData.houseNo,
        street: userData.street,
        city: userData.city,
        state: userData.state,
        country: userData.country,
      });

      setbankdetails({
        bank_Account_No: userData.bankAccountNo,
        IFSC_Code: userData.IFSCCode,
        account_Holder_Name: userData.accountHolderName,
        bank_Name: userData.BankName,
        branch_Name: userData.BranchName,
        UPIId: userData.UPIId,
      });

      setsideMenuData({
        id: userData.id,
        role: role,
        employee_id: userData.employee_id,
        Doj: userData.Doj,
        Dob: userData.Dob,
        username: userData.username,
        designation: userData.designation,
        noticePeriod: userData.noticePeriod,
        email: userData.email,
        houseNo: userData.houseNo,
        street: userData.street,
        city: userData.city,
        state: userData.state,
        country: userData.country,
        status: userData.status,
        facebookProfileLink: userData.facebookProfileLink,
        instagramProfileLink: userData.instagramProfileLink,
        twitterProfileLink: userData.twitterProfileLink,
        linkedInProfileLink: userData.linkedInProfileLink,
      });

      setdocuments({
        Education: {
          SSC: userData.SSC,
          TC: userData.TC,
          diploma: userData.diploma,
          intermediate: userData.intermediate,
          bachelor: userData.bachelor,
          master: userData.master,
          marksMemo: userData.marksMemo,
        },
        Goverment_Ids: {
          aadhar: userData.aadhar,
          panCard: userData.panCard,
        },
        Previous_Employment: {
          payslips: userData.payslips,
          resignationLette: userData.resignationLette,
          incrementLetter: userData.incrementLetter,
          experienceCertificate: userData.experienceCertificate,
          offerLetter: userData.offerLetter,
        },
      });

      setcompensation({
        status: userData.status,
        compensation: userData.compensation,
        doj: moment(userData.Doj).utc().format("DD-MM-YYYY"),
      });
    }
  }, [userData]);

  return (
    <div>
      {" "}
      <Stack
        direction="column"
        alignItems="start"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom>
          OnBoarding
        </Typography>
        <Breadcrumbs aria-label="breadcrumb">
          <NextLink color="inherit" href="/hr">
            Dashboard
          </NextLink>
          <NextLink color="inherit" href="/hr/employees">
            Users
          </NextLink>
          <Typography color="text.primary">Profile</Typography>
        </Breadcrumbs>
      </Stack>
      <Card>
        <Box
          sx={{
            width: "100%",
            typography: "body1",
            textTransform: "capitalize",
          }}
        >
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange}>
                <Tab label="Personal Details" value="1" />
                <Tab label="Bank Details" value="2" />
                <Tab label="Documents" value="3" />

                {userData.status == "accepted" && (
                  <Tab label="Compensation" value="4" />
                )}
              </TabList>
            </Box>
            <TabPanel value="1">
              <Personal
                menu={sideMenuData}
                data={personalData != null ? personalData : 0}
              />
            </TabPanel>
            <TabPanel value="2">
              <Bankdetails
                menu={sideMenuData}
                data={bankdetails != null ? bankdetails : 0}
              />
            </TabPanel>
            <TabPanel value="3">
              <Documents
                menu={sideMenuData}
                data={documents != null ? documents : 0}
                letters={lettersData}
              />
            </TabPanel>

            {userData.status == "accepted" && (
              <TabPanel value="4">
                <Compensation
                  menu={sideMenuData}
                  data={compensation != null ? compensation : 0}
                />
              </TabPanel>
            )}
          </TabContext>
        </Box>
      </Card>
    </div>
  );
};

export default Index;

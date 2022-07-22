import React from "react";
import NextLink from "next/link";
import { Typography, TextField, Grid, Card, Stack } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import MailIcon from "@mui/icons-material/Mail";
import { useState, useEffect } from "react";
import moment from "moment";
const style = {
  width: 270,
  m: 3,
};
const iconStyle = {
  position: "relative",
  top: "5px",
};

const Sidemenu = ({ data }) => {
  const [sidemenu, setsidemenu] = useState();
  useEffect(() => {
    setsidemenu(data);
  }, [data]);
  return (
    <Grid item xs={12} lg={3} md={3}>
      <div>
        {sidemenu !== undefined && (
          <div>
            <Card sx={{ boxShadow: 3, p: 3, mb: 2 }}>
              <Typography>
                {" "}
                <AccountCircleIcon sx={iconStyle} />{" "}
                {sidemenu.status == "accepted"
                  ? sidemenu.employee_id
                  : "XXXXXXXXXXXX"}
              </Typography>
              <Typography sx={{ my: 2 }} color="primary">
                <CalendarMonthIcon sx={iconStyle} />
                Hire Date
              </Typography>
              <Typography sx={{ my: 2 }}>
                {moment(sidemenu.Doj).utc().format("DD-MM-YYYY")}
              </Typography>
              <Typography sx={{ my: 2 }} variant="primary">
                Designation
              </Typography>
              <Typography sx={{ my: 2 }}>
                {" "}
                {sidemenu.designation != 0
                  ? sidemenu.designation
                  : "XXXXXXXXXXXX"}
              </Typography>

              <Typography sx={{ my: 2 }} sidemenu="primary">
                Notice Period
              </Typography>
              <Typography sx={{ my: 2 }}>
                {" "}
                {sidemenu.noticePeriod != "" ? sidemenu.noticePeriod : "XX"}
              </Typography>
            </Card>
            <Card sx={{ boxShadow: 0, p: 3 }}>
              <Typography sx={{ my: 2 }} color="primary">
                <LocationOnIcon sx={iconStyle} /> Location
              </Typography>

              <Typography sx={{ my: 2 }}>
                <LocationOnIcon sx={iconStyle} />{" "}
                {sidemenu.houseNo +
                  " " +
                  sidemenu.street +
                  " " +
                  sidemenu.city +
                  " " +
                  sidemenu.state +
                  " " +
                  sidemenu.country}
              </Typography>

              <Typography sx={{ my: 2 }}>
                <MailIcon sx={iconStyle} /> {sidemenu.email}
              </Typography>

              <Typography sx={{ my: 3 }} variant="h4">
                Social
              </Typography>

              <Stack spacing={2} direction="row">
                <NextLink
                  href={
                    sidemenu.linkedInProfileLink != null
                      ? sidemenu.linkedInProfileLink
                      : "#"
                  }
                >
                  <a target="_blank">
                    {" "}
                    <LinkedInIcon sx={iconStyle} />{" "}
                  </a>
                </NextLink>
                <NextLink
                  href={
                    sidemenu.instagramProfileLink != null
                      ? sidemenu.instagramProfileLink
                      : "#"
                  }
                >
                  <a target="_blank">
                    {" "}
                    <InstagramIcon sx={iconStyle} />{" "}
                  </a>
                </NextLink>
                <NextLink
                  href={
                    sidemenu.twitterProfileLink != null
                      ? sidemenu.twitterProfileLink
                      : "#"
                  }
                >
                  <a target="_blank">
                    {" "}
                    <TwitterIcon sx={iconStyle} />{" "}
                  </a>
                </NextLink>
                <NextLink
                  href={
                    sidemenu.facebookProfileLink != null
                      ? sidemenu.facebookProfileLink
                      : "#"
                  }
                >
                  <a target="_blank">
                    {" "}
                    <FacebookIcon sx={iconStyle} />
                  </a>
                </NextLink>
              </Stack>
            </Card>
          </div>
        )}
      </div>
    </Grid>
  );
};

export default Sidemenu;

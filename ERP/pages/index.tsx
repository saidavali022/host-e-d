import type { NextPage } from "next";
import NextHead from "next/head";
import Image from "next/image";
import NextLink from "next/link";
import styles from "@styles/Home.module.css";
// material
import { styled } from "@mui/material/styles";
import { Box, Card, Stack, Link, Container, Typography } from "@mui/material";

import { LoginForm } from "@sections/authentication/login";
// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

const Home: NextPage = () => {
  return (
    <>
      <RootStyle title="Login | Minimal-UI">
        <SectionStyle sx={{ display: { xs: "none", md: "flex" } }}>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome Back
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack sx={{ mb: 5 }}>
              <Typography variant="h4" gutterBottom>
                Sign in to E&D 360
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Enter your details below.
              </Typography>
            </Stack>
            <LoginForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </>
  );
};

export default Home;

Home.getLayout = function PageLayout(page) {
  return <>{page}</>;
};

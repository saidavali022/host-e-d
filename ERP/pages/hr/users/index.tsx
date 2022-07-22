import { useState, useEffect } from "react";
import UsersList from "@sections/dashboard/user/UsersList";
import DashboardLayout from "@layouts/hrdashboard";
import { useRouter } from "next/router";
import { Container, Stack, Breadcrumbs, Typography } from "@mui/material";
import NextLink from "next/link";

// components
import Page from "@components/Page";

const data = {
  status: "pending",
  title: "OnBoarding",
};

export default function User() {
  return (
    <>
      <Page title="Users">
        <Container maxWidth={false}>
          <Stack
            direction="row"
            alignItems="start"
            justifyContent="space-between"
            mb={5}
          >
            {" "}
            <Stack
              direction="column"
              alignItems="start"
              justifyContent="space-between"
            >
              <Typography variant="h4" gutterBottom>
                View OnBoarding
              </Typography>
              <Breadcrumbs aria-label="breadcrumb">
                <NextLink href="/hr">Dashboard</NextLink>
                <Typography color="text.primary">View OnBoarding</Typography>
              </Breadcrumbs>
            </Stack>
          </Stack>
          <UsersList data={data} />
        </Container>
      </Page>
    </>
  );
}
// User.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

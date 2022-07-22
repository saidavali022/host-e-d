import React from "react";
import { useState, useEffect } from "react";
import UsersList from "@sections/dashboard/user/UsersList";
import {
  Stack,
  Typography,
  Breadcrumbs,
  Button,
  Container,
} from "@mui/material";
import NextLink from "next/link";
import Iconify from "@components/Iconify";
import Index from "pages/hr/employees/index";
import Page from "@components/Page";
const data = {
  status: "accepted",
  title: "Employee",
};
const index = () => {
  return (
    <Page title="User | E&D 360">
      <Container maxWidth={false}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Stack
            direction="column"
            alignItems="start"
            justifyContent="space-between"
          >
            <Typography variant="h4" gutterBottom>
              {data.title}
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <NextLink color="inherit" href="/admin">
                Dashboard
              </NextLink>
              <Typography color="text.primary">Users</Typography>
            </Breadcrumbs>
          </Stack>
          {data.status == "pending" && (
            <NextLink href="./users/create">
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Paperless OnBoarding.
              </Button>
            </NextLink>
          )}
        </Stack>
        <UsersList data={data} />
      </Container>
    </Page>
  );
};
export default index;

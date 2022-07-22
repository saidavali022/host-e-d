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
import { useRouter } from "next/router";

// components
import Page from "@components/Page";

const data = {
  status: "accepted",
  title: "Employee",
};
export default function Index() {
  return (
    <>
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
                <NextLink color="inherit" href="/hr" passHref>
                  Dashboard
                </NextLink>
                <Typography color="text.primary">Users</Typography>
              </Breadcrumbs>
            </Stack>
            {data.status == "pending" && (
              <NextLink href="./users/create" passHref>
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
    </>
  );
}

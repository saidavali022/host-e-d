import { Container, Stack, Typography, Breadcrumbs } from "@mui/material";
import Page from "@components/Page";
import NextLink from "next/link";
import UserShiftChange from "@sections/dashboard/user/UserShiftChange";
export default function Shifts() {
  return (
    <Page title="Shifts | E & D 360">
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
              Shifts
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <NextLink href="/hr">Dashboard</NextLink>
              <NextLink href="/hr/users">Users</NextLink>
              <Typography color="text.primary">Shifts</Typography>
            </Breadcrumbs>
          </Stack>
          <Stack
            direction="column"
            alignItems="end"
            justifyContent="space-between"
          ></Stack>
        </Stack>
        <UserShiftChange />
      </Container>
    </Page>
  );
}

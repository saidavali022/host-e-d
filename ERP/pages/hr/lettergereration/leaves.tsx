import React from "react";
import Leave from "pages/components/letter_generation/Getleaves";
import Page from "@components/Page";
import { Container } from "@mui/material";
const leaves = () => {
  return (
    <Page title="E&D Leave">
      <Container maxWidth={false}>
        <Leave role="hr" />
      </Container>
    </Page>
  );
};

export default leaves;
// leaves.getLayout = (page: String) => <DashboardLayout>{page}</DashboardLayout>;

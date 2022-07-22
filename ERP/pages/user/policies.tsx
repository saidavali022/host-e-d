import React from "react";
import Page from "@components/Page";
import Policies_procedures from "pages/components/Policies_procedures";
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
const Policies = () => {
  return (
    <Page title="Policies">
      <Container>
        <Policies_procedures />
      </Container>
    </Page>
  );
};

export default Policies;

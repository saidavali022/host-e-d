import PropTypes from "prop-types";
// material
import { visuallyHidden } from "@mui/utils";

import NextLink from "next/link";
import {
  Box,
  Checkbox,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
  TextField,
  Typography,
  Card,
  Grid,
} from "@mui/material";

// ----------------------------------------------------------------------

export default function UserProfilePreviousEmployment() {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              padding: 2,
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Company: Explore and Do Technologies Pvt. Ltd.
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Start Date: 2020-10-12
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              End Date: 2021-12-05
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              End Date: 2021-12-05
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Experience Letter: <NextLink href="#">letter.pdf</NextLink>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Offer Letter: offer.pdf
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Reliving Letter: reliving.pdf
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

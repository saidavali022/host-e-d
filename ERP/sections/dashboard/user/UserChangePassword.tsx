import PropTypes from "prop-types";
// material
import { visuallyHidden } from "@mui/utils";
import {
  Box,
  Checkbox,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
  TextField,
} from "@mui/material";

// ----------------------------------------------------------------------

export default function UserChangePassword() {
  return (
    <>
      <TextField
        fullWidth
        label="Old Password"
        color="primary"
        type="password"
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="New Password"
        color="primary"
        type="password"
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Confirm New Password"
        color="primary"
        type="password"
        sx={{ marginBottom: 2 }}
      />
    </>
  );
}

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
  Grid,
  Card,
  Avatar,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";

// ----------------------------------------------------------------------

export default function UserProfileGeneral() {
  const { data: session, loading } = useSession();
  if (loading == "loading") {
    return <></>;
  }
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ padding: 4, textAlign: "center" }}>
            <Avatar
              src={session?.user?.profile_img}
              alt={session?.user?.sudo_name}
              sx={{ width: 100, height: 100, margin: "auto" }}
            />
            <Typography>{session?.user?.sudo_name}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              padding: 2,
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
          >
            <TextField
              id="username"
              label="Name"
              value={session?.user?.employee_id}
              InputProps={{
                readOnly: true,
              }}
              focused
            />
            <TextField
              id="user-email"
              label="Email"
              value={session?.user?.email}
              InputProps={{
                readOnly: true,
              }}
              focused
            />
            <TextField
              id="user-phone"
              label="Phone"
              value={session?.user?.phone}
              InputProps={{
                readOnly: true,
              }}
              focused
            />
            <TextField
              id="user-address"
              label="Address"
              value={session?.user?.address}
              InputProps={{
                readOnly: true,
              }}
              focused
            />

            <TextField
              id="user-country"
              label="Country"
              value={session?.user?.country}
              InputProps={{
                readOnly: true,
              }}
              focused
            />
            <TextField
              id="user-state"
              label="State/Region"
              value={session?.user?.state}
              InputProps={{
                readOnly: true,
              }}
              focused
            />
            <TextField
              id="user-city"
              label="City"
              value={session?.user?.city}
              InputProps={{
                readOnly: true,
              }}
              focused
            />
            <TextField
              id="user-zip"
              label="Zip"
              value={session?.user?.zip_code}
              InputProps={{
                readOnly: true,
              }}
              focused
            />
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

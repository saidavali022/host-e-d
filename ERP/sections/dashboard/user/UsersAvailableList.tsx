import { useState, MouseEvent } from "react";
import {
  Typography,
  Button,
  Menu,
  MenuItem,
  Popover,
  Stack,
  Avatar,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridCallbackDetails,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";

import { fTime } from "@utils/formatTime";

interface IAvailableUser {
  employee_id: string;
  status: string;
  firstName: string;
  lastName: string;
  profile_img: string;
}

const columns = [
  {
    field: "id",
    headerName: "ID",
    hide: true,
  },
  {
    field: "employee_id",
    headerName: "Employee ID",
    width: 200,
  },
  {
    field: "firstName",
    headerName: "First Name",
    renderCell: (params: GridRenderCellParams) => {
      return (
        <Typography sx={{ textTransform: "capitalize" }}>
          {params.row.firstName}
        </Typography>
      );
    },
  },
  {
    field: "lastName",
    headerName: "Last Name",
    renderCell: (params: GridRenderCellParams) => {
      return (
        <Typography sx={{ textTransform: "capitalize" }}>
          {params.row.lastName}
        </Typography>
      );
    },
  },
  {
    field: "shift_in",
    headerName: "Shift Start",
    renderCell: (params: GridRenderCellParams) => {
      return fTime(params.row.shift_in);
    },
  },
  {
    field: "log_in",
    headerName: "Login At",
    renderCell: (params: GridRenderCellParams) => {
      return fTime(params.row.log_in);
    },
  },
];

export default function UsersAvailableList({
  users,
}: {
  users: IAvailableUser[];
}) {
  return (
    <div>
      <Typography variant="h4" sx={{ my: 2, textTransform: "uppercase" }}>
        Available Employees
      </Typography>
      <DataGrid rows={users} columns={columns} autoHeight={true} />
    </div>
  );
}

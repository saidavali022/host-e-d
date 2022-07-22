import { useState, useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridCallbackDetails,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import NextLink from "next/link";
import DashboardLayout from "@layouts/hrdashboard";
import { useRouter } from "next/router";
// material
import {
  Stack,
  Button,
  Container,
  Typography,
  Breadcrumbs,
  Chip,
} from "@mui/material";
// components
import Page from "@components/Page";
import Iconify from "@components/Iconify";
import axios from "@utils/defaultImports";
import { fDate, fDateTimeSuffix } from "@utils/formatTime";
export default function UsersList({ data }: any) {
  const router = useRouter();
  const page = router.asPath.split("/")[1];
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 200, hide: true },
    {
      field: "firstName",
      headerName: "First name",
      minWidth: 200,
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
      headerName: "Last name",
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography sx={{ textTransform: "capitalize" }}>
            {params.row.lastName}
          </Typography>
        );
      },
    },
    {
      field: "email",
      headerName: "Personal Email",
      minWidth: 300,
    },
    {
      field: "phone",
      minWidth: 200,
      headerName: "Phone",
    },

    {
      field: "gender",
      minWidth: 100,
      headerName: "Gender",
    },
    {
      field: "Doj",
      minWidth: 250,
      headerName: "DOJ",
      renderCell: (params: GridRenderCellParams) => {
        return fDate(params.row.Doj);
      },
    },
    {
      field: "accepted_at",
      minWidth: 250,
      headerName: "Accepted At",
      renderCell: (params: GridRenderCellParams) => {
        return fDateTimeSuffix(params.row.accepted_at);
      },
    },
    {
      field: "status",
      minWidth: 200,
      headerName: "status",
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Chip
            label={params.row.status}
            sx={{ color: "white", textTransform: "capitalize" }}
            color={userAcceptedChipColor(params)}
          />
        );
      },
    },
    {
      field: "employee_id",
      minWidth: 200,
      headerName: "Employee ID",
    },
    {
      field: "password",
      minWidth: 200,
      headerName: "Password",
    },
    {
      field: "action",
      minWidth: 200,
      headerName: "Action",
      renderCell: (params: GridRenderCellParams) => {
        return (
          // <Chip
          //   label={params.row.status}
          //   sx={{ color: "white" }}
          //   color={userAcceptedChipColor(params)}
          // />
          <NextLink
            href={"/" + page + "/users/edit/?id=" + params.row.id}
            passHref
          >
            <Button variant="outlined">Edit</Button>
          </NextLink>
        );
      },
    },
  ];

  const userAcceptedChipColor = (params: any) => {
    if (params.row.status === "accepted") return "primary";
    if (params.row.status === "pending") return "warning";
  };

  const [rows, setrows] = useState([]);
  useEffect(() => {
    axios({
      method: "get",
      url: "/users/" + data.status,
      data: {
        status: data.status,
      },
    }).then(function (response: any) {
      if (response.status === 200) {
        setrows(response.data);
      }
    });
  }, [data.status]);

  const rowDoubleClick = (
    params: GridRowParams,
    event: MuiEvent<MouseEvent>,
    details: GridCallbackDetails
  ) => {
    event.preventDefault();
    router.push("./users/profile?id=" + params.row.id);
  };

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight={true}
      pageSize={10}
      rowsPerPageOptions={[10]}
      onRowDoubleClick={rowDoubleClick}
    />
  );
}

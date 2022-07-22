import { useState, useEffect } from "react";
import Link from "next/link";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { Card, Stack, Avatar, Tooltip, Typography } from "@mui/material";
import Router from "next/router";
const Letterlist = (props) => {
  const [rowData, setrowData] = useState([]);

  useEffect(() => {
    setrowData(props.data);
  }, [props.data]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "S.No", width: 100, hide: true },
    {
      field: "name",
      headerName: "Employee Name",
      width: 250,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <Tooltip title={params.row.name.username} placement="right-start">
              <>
                <Avatar
                  alt={params.row.name.username}
                  src={
                    process.env.NEXT_PUBLIC_HOST +
                    "/" +
                    params.row.name.passportSizePhoto
                  }
                  sx={{ mx: 1 }}
                />
                <Typography variant="subtitle1">
                  {params.row.name.username}
                </Typography>
              </>
            </Tooltip>
          </>
        );
      },
    },
    { field: "employee_id", headerName: "Employee ID", width: 200 },
    {
      field: "action",
      headerName: "action",
      width: 300,
      renderCell: renderAction,
    },
  ];

  function renderAction(params: GridRenderCellParams) {
    return (
      <Stack direction="row" spacing={2}>
        <Link href={"http://localhost:3001/" + params.row.letter}>
          <a target="_blank">
            {" "}
            <InsertDriveFileIcon color="primary" />
          </a>
        </Link>
      </Stack>
    );
  }

  return (
    <Card
      sx={{
        height: 700,
        width: "100%",
        textTransform: "capitalize",
      }}
    >
      <DataGrid
        rows={rowData}
        columns={columns}
        pageSize={10}
        components={{
          Toolbar: GridToolbar,
        }}
        rowsPerPageOptions={[10]}
      />
    </Card>
  );
};

export default Letterlist;

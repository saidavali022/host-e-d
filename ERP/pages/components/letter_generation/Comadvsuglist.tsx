import { useMemo, useState, useEffect } from "react";
import styles from "@styles/Users.module.css";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Container,
  Box,
  TextField,
  Stack,
  Card,
  Typography,
  Button,
  Drawer,
  Avatar,
} from "@mui/material";
import moment from "moment";
const Comadvsuglistdata = (props) => {
  const [formData, setformData] = useState();
  const [editId, setEditId] = useState();
  const [anchor, setanchor] = useState(false);
  const [rowData, setrowData] = useState([]);

  useEffect(() => {
    setrowData(props.data);
  }, [props.data]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "S.No", width: 100, hide: true },
    // { field: "employee_id", headerName: "Employee ID", width: 200 },

    {
      field: "employee",
      headerName: "Employee",
      width: 250,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <Avatar
              alt={params.row.employee?.username}
              src={
                process.env.NEXT_PUBLIC_HOST +
                "/" +
                params.row.employee?.passportSizePhoto
              }
              sx={{ mx: 1 }}
            />
            <Typography variant="subtitle1">
              {params.row.employee.username}
            </Typography>
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      type: "actions",
      width: 220,
      renderCell: renderAction,
    },
  ];

  function renderAction(params: GridRenderCellParams) {
    return (
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="primary"
          id={params.id}
          onClick={() => {
            setanchor(true);
            setEditId(params.id);
          }}
        >
          View
        </Button>
      </Stack>
    );
  }

  useMemo(() => {
    const editDate = rowData.filter(
      (rowData: any) => rowData.id == editId || 0
    );
    if (editDate[0]) setformData(editDate[0]);
  }, [editId]);

  return (
    <Card
      sx={{
        height: 650,
        width: "100%",
      }}
    >
      <DataGrid
        rows={rowData}
        columns={columns}
        pageSize={10}
        checkboxSelection
        components={{
          Toolbar: GridToolbar,
        }}
        rowsPerPageOptions={[10]}
      />

      <Drawer anchor="right" open={anchor} onClose={() => setanchor(false)}>
        <Box sx={{ width: 450 }}>
          <Container>
            <form>
              <Typography variant="h4" sx={{ mt: 4 }}>
                View Data
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Employee Id"
                  type="text"
                  disabled
                  value={formData?.employee_id}
                  sx={{ width: "100%" }}
                  className={styles.taskInputField}
                />
                <TextField
                  label="Date"
                  type="text"
                  disabled
                  value={moment(formData?.created_at)
                    .utc()
                    .format("MMM DD YYYY")}
                  sx={{ width: "100%" }}
                  className={styles.taskInputField}
                />

                <TextField
                  disabled
                  required
                  label="Message"
                  className={styles.taskInputField}
                  multiline
                  rows={8}
                  value={formData?.message}
                />
              </Stack>
            </form>
          </Container>
        </Box>
      </Drawer>
    </Card>
  );
};

export default Comadvsuglistdata;

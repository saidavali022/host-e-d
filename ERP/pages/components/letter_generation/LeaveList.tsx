import { useMemo, useState, useEffect } from "react";
import styles from "../../../styles/Users.module.css";
import { forwardRef, useImperativeHandle } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import { leaveColorChip } from "@utils/chipsColor";
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
  Chip,
} from "@mui/material";

const Leavelist = forwardRef((props, ref) => {
  const router = useRouter();

  const [formData, setformData] = useState();
  const [editId, setEditId] = useState();
  const [anchor, setanchor] = useState(false);
  const [rowData, setrowData] = useState([]);
  const [id, setId] = useState();

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  useImperativeHandle(ref, () => ({
    passToChild() {
      setEditId(0);
      setanchor(false);
    },
  }));

  useEffect(() => {
    setrowData(props.data);
  }, [props.data]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "S.No", width: 100, hide: true },
    { field: "employee_id", headerName: "Employee ID", width: 200 },
    {
      field: "employee.username",
      headerName: "User Name",
      width: 200,
      renderCell: (params) => {
        return params.row.employee.username;
      },
    },
    {
      field: "created_at",
      headerName: "Applied On",
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        return moment(params.row.created_at).utc().format("MMM DD YYYY");
      },
    },
    { field: "from", headerName: "From", width: 200 },
    { field: "to", headerName: "To", width: 200 },
    { field: "leave_dates", headerName: "Leave Dates", width: 250 },
    {
      field: "status",
      headerName: "Status",
      type: "status",
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Chip
            sx={{ color: "#fff", textTransform: "capitalize" }}
            label={params.row.leave_status}
            color={leaveColorChip(params.row.leave_status)}
          />
        );
      },
    },

    {
      field: "action",
      headerName: "Action",
      type: "actions",
      width: 100,
      renderCell: renderAction,
    },
  ];

  function renderAction(params: GridRenderCellParams) {
    return (
      <Stack direction="row" spacing={2}>
        <Button
          size="normal"
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

  useMemo(() => {
    if (id) {
      setTimeout(() => {
        setanchor(true);
        setEditId(id);
      }, 300);
    }
  }, [id]);

  return (
    <>
      <div>
        <DataGrid
          sx={{ textTransform: "capitalize" }}
          rows={rowData}
          columns={columns}
          autoHeight={true}
          pageSize={10}
          components={{
            Toolbar: GridToolbar,
          }}
          rowsPerPageOptions={[10]}
        />
      </div>
      <Drawer anchor="right" open={anchor} onClose={() => setanchor(false)}>
        <Box sx={{ width: 450 }}>
          <Container>
            <form>
              <Typography variant="h4" sx={{ mt: 4 }}>
                Request Data
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
                  label="Apply Date"
                  type="text"
                  disabled
                  value={moment(formData?.created_at)
                    .utc()
                    .format("MMM DD YYYY")}
                  sx={{ width: "100%" }}
                  className={styles.taskInputField}
                />

                <TextField
                  label="From"
                  type="text"
                  disabled
                  value={formData?.from}
                  sx={{ width: "100%" }}
                  className={styles.taskInputField}
                />

                <TextField
                  label="To"
                  type="text"
                  disabled
                  value={formData?.to + "@exploreanddo.com"}
                  sx={{ width: "100%" }}
                  className={styles.taskInputField}
                />
                <TextField
                  label="Leave Dates"
                  type="text"
                  disabled
                  value={formData?.leave_dates}
                  sx={{ width: "100%" }}
                  className={styles.taskInputField}
                />

                <TextField
                  disabled
                  required
                  label="Reason"
                  className={styles.taskInputField}
                  multiline
                  rows={8}
                  value={formData?.reason}
                />
              </Stack>

              {formData?.leave_status == "pending" && props.role == "admin" ? (
                <Stack spacing={2} sx={{ mt: 5 }} direction="row">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      props.passToParaent({
                        status: "accepted",
                        field: "leave_status",
                        id: formData?.id,
                        employee_id: formData?.employee_id,
                      })
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      props.passToParaent({
                        status: "rejected",
                        field: "leave_status",
                        id: formData?.id,
                      })
                    }
                  >
                    Reject
                  </Button>
                </Stack>
              ) : (
                <Stack direction="row" spacing={2}>
                  {formData?.leave_status == "pending" ? (
                    <Button
                      variant="contained"
                      disabled
                      sx={{ mt: 5 }}
                      color="primary"
                    >
                      Awaiting
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      disabled
                      sx={{ mt: 5 }}
                      color="primary"
                    >
                      {formData?.leave_status}
                    </Button>
                  )}
                </Stack>
              )}
            </form>
          </Container>
        </Box>
      </Drawer>
    </>
  );
});

export default Leavelist;

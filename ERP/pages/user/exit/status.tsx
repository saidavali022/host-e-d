import { useEffect, useState, useMemo } from "react";
import UserDashboardLayout from "@layouts/userdashboard";
import styles from "@styles/Users.module.css";
import NextLink from "next/link";
import { useSelector } from "react-redux";
import Page from "@components/Page";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  TextField,
  Breadcrumbs,
  MenuItem,
  Menu,
  Drawer,
  Card,
} from "@mui/material";

const status = () => {
  const [rows, setRows] = useState([]);
  const [anchor, setanchor] = useState(false);
  const [formData, setformData] = useState();
  const [editId, setEditId] = useState();

  const globalState = useSelector((state) => state.globalState);

  useMemo(() => {
    const editDate = rows.filter((rows: any) => rows.id == editId || 0);
    if (editDate[0]) setformData(editDate[0]);
  }, [editId]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 120, hide: true },
    { field: "employee_id", headerName: "Employee ID", minWidth: 180 },
    { field: "created_at", headerName: "Date", minWidth: 220 },
    { field: "start_date", headerName: "Start Date", minWidth: 220 },
    { field: "end_date", headerName: "End Date", minWidth: 220 },
    { field: "status", headerName: "Status", minWidth: 200 },
    {
      field: "action",
      headerName: "Action",
      minWidth: 200,
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

  const getData = () => {
    axios({
      method: "get",
      url: `${"/exits/" + globalState.Employee_id}`,
    }).then(function (response: any) {
      if (response.status === 200) {
        console.log(response.data);
        setRows(response.data);
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Page title="Exit Status | E & D 360">
        <Container>
          <Stack
            direction="column"
            alignItems="start"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom>
              Exit Status
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <NextLink href="/user">Dashboard</NextLink>
              <NextLink href="/user/exit">Exit</NextLink>
              <Typography color="text.primary">Status</Typography>
            </Breadcrumbs>
          </Stack>
          <div style={{ height: 650, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </div>

          <Drawer anchor="right" open={anchor} onClose={() => setanchor(false)}>
            <Box sx={{ width: "450px" }}>
              <Container>
                <Typography variant="h4" sx={{ mt: 4 }}>
                  View Resignation Letter
                </Typography>
                <Card>
                  <TextField
                    required
                    label="Employee Id"
                    name="employee_id"
                    className={styles.taskInputField}
                    value={formData?.employee_id}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    required
                    label="created_at"
                    name="created_at"
                    className={styles.taskInputField}
                    value={formData?.created_at}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    required
                    label="start_date"
                    name="start_date"
                    className={styles.taskInputField}
                    value={formData?.start_date}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    required
                    label="end_date"
                    name="end_date"
                    className={styles.taskInputField}
                    value={formData?.end_date}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    required
                    label="status"
                    name="status"
                    className={styles.taskInputField}
                    value={formData?.status}
                    InputProps={{
                      readOnly: true,
                    }}
                  />

                  <TextField
                    required
                    label="Reason"
                    name="Reason"
                    className={styles.taskInputField}
                    multiline="true"
                    minRows="4"
                    value={formData?.reason}
                  />

                  <Stack direction="row" spacing={2}>
                    {formData?.status == "pending" ? (
                      <Stack direction="row" spacing={2}>
                        <Button variant="contained">Waiting</Button>
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={2}>
                        <Button disabled variant="contained">
                          {formData?.status}
                        </Button>
                        {formData?.send_feedback_form == "awaiting" && (
                          <NextLink href="./feedback">
                            <Button variant="contained">Send FeedBack</Button>
                          </NextLink>
                        )}

                        {formData?.send_feedback_form == "completed" && (
                          <NextLink href="./feedback">
                            <Button variant="contained">View FeedBack</Button>
                          </NextLink>
                        )}

                        {formData?.send_check_list == "awaiting" && (
                          <NextLink href="./checklist">
                            <Button variant="contained">Send CheckList</Button>
                          </NextLink>
                        )}

                        {formData?.send_check_list == "completed" && (
                          <NextLink href="./checklist">
                            <Button variant="contained">View CheckList</Button>
                          </NextLink>
                        )}
                      </Stack>
                    )}
                  </Stack>
                </Card>
              </Container>
            </Box>
          </Drawer>
        </Container>
      </Page>
    </>
  );
};
export default status;

// status.getLayout = (page) => <UserDashboardLayout>{page}</UserDashboardLayout>;

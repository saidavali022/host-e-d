import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@layouts/dashboard";
import styles from "@styles/Users.module.css";
import Page from "@components/Page";
import NextLink from "next/link";

import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import "react-toastify/dist/ReactToastify.css";
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Menu,
  Drawer,
  Card,
} from "@mui/material";

const index = () => {
  const [rows, setRows] = useState([]);
  const [anchor, setanchor] = useState(false);
  const [formData, setformData] = useState();
  const [editId, setEditId] = useState();

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
      url: "/exits/",
    }).then(function (response: any) {
      if (response.status === 200) {
        setRows(response.data);
        console.log(response.data);
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const updateStatus = (field: String, value: String) => {
    axios({
      method: "put",
      url: `${"/exits/" + formData.employee_id}`,
      data: {
        [`${field}`]: value,
      },
    }).then(function (response: any) {
      if (response.status === 200) {
        toast.success("success", {
          theme: "colored",
        });
        setanchor(false);
        getData();
        setEditId(0);
      }
    });
  };

  return (
    <Page>
      <Container>
        <div style={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>

        <Drawer anchor="right" open={anchor} onClose={() => setanchor(false)}>
          <Box sx={{ width: 550 }}>
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
                      <Button
                        variant="contained"
                        id="accepted"
                        onClick={() => updateStatus("status", "accepted")}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        id="rejected"
                        onClick={() => updateStatus("status", "rejected")}
                      >
                        Reject
                      </Button>
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing={2}>
                      <Button disabled variant="contained">
                        {formData?.status}
                      </Button>

                      {formData?.status == "accepted" && (
                        <Stack direction="row" spacing={2}>
                          {formData?.send_feedback_form == "completed" ? (
                            <Stack direction="row" spacing={2}>
                              <NextLink
                                href={{
                                  pathname: "./exits/feedback",
                                  query: { empId: formData?.employee_id },
                                }}
                              >
                                <Button variant="contained">
                                  View FeedBack
                                </Button>
                              </NextLink>

                              {formData?.send_check_list == "pending" && (
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    updateStatus("send_check_list", "awaiting")
                                  }
                                >
                                  Send Check List
                                </Button>
                              )}
                            </Stack>
                          ) : (
                            <Stack direction="row" spacing={2}>
                              {formData?.send_feedback_form == "awaiting" ? (
                                <Button variant="contained">
                                  Awaiting Feed Back
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    updateStatus(
                                      "send_feedback_form",
                                      "awaiting"
                                    )
                                  }
                                >
                                  Send FeedBack
                                </Button>
                              )}
                            </Stack>
                          )}

                          {formData?.send_check_list == "completed" ? (
                            <NextLink
                              href={{
                                pathname: "./exits/checklist",
                                query: { empId: formData?.employee_id },
                              }}
                            >
                              <Button variant="contained">
                                View Check List
                              </Button>
                            </NextLink>
                          ) : (
                            <Stack direction="row" spacing={2}>
                              {formData?.send_check_list == "awaiting" && (
                                <Button variant="contained">
                                  Awaiting CheckList
                                </Button>
                              )}
                            </Stack>
                          )}
                        </Stack>
                      )}
                    </Stack>
                  )}
                </Stack>
              </Card>
            </Container>
          </Box>
        </Drawer>
        {ToastContainer_box}
      </Container>
    </Page>
  );
};
export default index;

// index.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

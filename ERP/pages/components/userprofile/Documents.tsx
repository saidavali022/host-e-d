import { useState, useEffect } from "react";
import Sidemenu from "./Sidemenu";
import {
  Grid,
  Card,
  Button,
  Drawer,
  Box,
  TextField,
  MenuItem,
  Container,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import InsertDriveFileSharpIcon from "@mui/icons-material/InsertDriveFileSharp";
import { Stack, Typography } from "@mui/material";
import styles from "@styles/Users.module.css";
import NextLink from "next/link";
import axios, { toast, ToastContainer_box } from "@utils/defaultImports";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { v1 as uuidv1 } from "uuid";
import moment from "moment";

const Documents = (props) => {
  const router = useRouter();
  const [formData, setformData] = useState({
    field: "status",
    value: "accepted",
  });
  const [open, setopen] = useState(false);
  const [openLetters, setOpenLetters] = useState(false);
  const [subfolders, setsubfolders] = useState();
  const [anchor, setanchor] = useState(false);
  const [empId, setempId] = useState(0);
  const folder = {
    position: "relative",
    top: "-30px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "18px",
  };

  const openfolder = (item) => {
    setopen(true);
    setOpenLetters(false);
    setsubfolders(item);
  };

  const openLettersFolder = () => {
    setOpenLetters(true);
    setopen(false);
  };

  const employeeIdFormat = (
    "ED" +
    moment(props.menu.Doj).utc().format("DDMMYY") +
    props.menu.username.substring(0, 3) +
    moment(props.menu.Dob).utc().format("DDMM")
  )
    .toString()
    .toUpperCase();
  useEffect(() => setempId(employeeIdFormat), [empId]);

  const education = Object.keys(props.data).map((item, index) => {
    return (
      <Typography>
        <CreateNewFolderIcon
          onClick={() => openfolder(item)}
          color="info"
          sx={{ fontSize: "150px" }}
        />
        <p style={folder}>{item.replaceAll("_", " ")}</p>
      </Typography>
    );
  });

  const updateStatus = (data: any) => {
    axios({
      method: "put",
      url: `/users/data/${props.menu.id}`,
      data: {
        [data.field]: data.value,
        employee_id: empId,
        designation: data.designation,
        department: data.department,
        compensation: data.compensation,
        noticePeriod: data.noticePeriod,
        role: data.role,
        accepted_at: new Date(),
        password: uuidv1().substring(1, 8),
      },
    })
      .then((response: any) => {
        if (response.status == 200) {
          router.push("/hr/employees");
          toast.success("success", {
            theme: "colored",
          });
        }
      })
      .catch(function (error: any) {});
  };

  const getFormData = (event: any) => {
    setformData({ ...formData, [event.target.name]: event.target.value });
  };

  const submitFormData = (event) => {
    event.preventDefault();
    updateStatus(formData);
  };

  console.log(props.letters);

  return (
    <div>
      <Grid container spacing={2}>
        <Sidemenu data={props.menu} />
        <Grid item xs={12} lg={9} md={7}>
          <Stack direction="row" spacing={3} sx={{ overflow: "auto" }}>
            {education}

            <Typography>
              <CreateNewFolderIcon
                onClick={() => openLettersFolder()}
                color="info"
                sx={{ fontSize: "150px" }}
              />
              <p style={folder}>E&D Letters</p>
            </Typography>
          </Stack>

          <Stack direction="row" spacing={4} sx={{ overflow: "auto" }}>
            {open &&
              Object.entries(props.data[subfolders]).map(([key, value]) => {
                return (
                  <Typography>
                    {value.length > 3 && (
                      <Typography>
                        <NextLink href={process.env.NEXT_PUBLIC_HOST + value}>
                          <a target="_blank">
                            <InsertDriveFileSharpIcon
                              color="primary"
                              sx={{ fontSize: "80px" }}
                            />
                          </a>
                        </NextLink>
                        <p style={folder}>{key}</p>
                      </Typography>
                    )}
                  </Typography>
                );
              })}

            {openLetters &&
              props.letters.map((item, index) => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked
                        defaultChecked
                        name={props.letters[index].letter_type}
                      />
                    }
                    label={props.letters[index].letter_type}
                  />
                );
              })}
          </Stack>

          <Stack spacing={2} direction="row">
            {props.menu.status == "pending" && props.menu.role == "hr" ? (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setanchor(true)}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() =>
                    updateStatus({ field: "status", value: "rejected" })
                  }
                >
                  Reject
                </Button>
              </Stack>
            ) : (
              props.menu.role == "hr" && (
                <Button variant="contained" color="info" disabled>
                  {props.menu.status}
                </Button>
              )
            )}
          </Stack>
        </Grid>
      </Grid>
      {ToastContainer_box}

      <Drawer anchor="right" open={anchor} onClose={() => setanchor(false)}>
        <Container>
          <form autocomplete="off" onSubmit={submitFormData}>
            <Box sx={{ width: 450, mt: 5 }}>
              <Typography></Typography>
              <TextField
                required
                label="Notice Period"
                name="noticePeriod"
                className={styles.taskInputField}
                onChange={getFormData}
              />
              <TextField
                required
                label="Compensation"
                name="compensation"
                className={styles.taskInputField}
                onChange={getFormData}
              />
              <TextField
                required
                label="Department"
                name="department"
                className={styles.taskInputField}
                onChange={getFormData}
                select
              >
                <MenuItem value="human resource management">
                  Human Resource Management
                </MenuItem>
                <MenuItem value="software development">
                  Software Development
                </MenuItem>
                <MenuItem value="lead generation">Lead Generation</MenuItem>
                <MenuItem value="tech support">Tech Support</MenuItem>
              </TextField>
              <TextField
                required
                label="Designation"
                name="designation"
                className={styles.taskInputField}
                onChange={getFormData}
              />

              <TextField
                required
                label="Role"
                name="role"
                className={styles.taskInputField}
                onChange={getFormData}
                select
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="hr">HR</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>

              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained" color="primary">
                  Update
                </Button>
              </Stack>
            </Box>
          </form>
        </Container>
      </Drawer>
    </div>
  );
};
export default Documents;

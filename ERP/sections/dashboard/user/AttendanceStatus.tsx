import { useState, useEffect, ReactElement } from "react";
import {
  Box,
  Grid,
  Container,
  Typography,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useSelector, useDispatch } from "react-redux";
import axios from "@utils/defaultImports";
const AttendanceStatus = () => {
  const globalState = useSelector((state) => state.globalState);
  const dispatch = useDispatch();
  const [availabilityStatus, setAvailabilityStatus] = useState("unavailable");
  const handleAvailabilityChange = (event: SelectChangeEvent) => {
    if (globalState?.Employee_id) {
      axios
        .put(`/attendance/${globalState?.Employee_id}/availability`, {
          status: event.target.value,
        })
        .then((res: any) => {
          console.info("update status to - ", event.target.value);
          setAvailabilityStatus(res.data.status);
        });
    }
  };

  useEffect(() => {
    if (globalState?.Employee_id) {
      axios
        .get(`/attendance/${globalState?.Employee_id}/availability`)
        .then((res: any) => {
          if (res.data.status == "unavailable") {
            axios
              .post(`/attendance/${globalState?.Employee_id}`)
              .then((res: any) => {
                setAvailabilityStatus(res.data.status);
              });
          } else {
            setAvailabilityStatus(res.data.status);
          }
        });
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: "available_status",
      payload: { available_status: availabilityStatus },
    });
  }, [availabilityStatus]);

  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="availability-status">Status</InputLabel>
        <Select
          labelId="availability-status"
          id="availability-status-select"
          value={availabilityStatus}
          label="Status"
          onChange={handleAvailabilityChange}
        >
          <MenuItem value="notavailable" disabled>
            <em>Not Available</em>
          </MenuItem>
          <MenuItem value="available">Available</MenuItem>
          <MenuItem value="break">Break</MenuItem>
          <MenuItem value="salah">Salah</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default AttendanceStatus;

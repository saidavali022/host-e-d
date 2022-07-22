import { io } from "socket.io-client";
import { useState } from "react";
// material
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
//
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
interface LayoutProps {
  children: React.ReactNode;
}
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }: LayoutProps) {
  const socket = io("http://192.168.1.187:3001/");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const globalState = useSelector((state) => state.globalState);
  if (globalState.role != "user" || !globalState.Employee_id) {
    router.push("/");
  }
  const [openNotifinaction, setOpenNotifinaction] = useState(false);
  const [message, setMessage] = useState();
  socket.on("sendNotification", (details) => {
    if (details.employee_id == globalState.Employee_id) {
      // toast.success(details.message, {
      //   theme: "colored",
      // });
      setOpenNotifinaction(true);
      setMessage(details.message);
    }
  });

  const handleClose = () => {
    setOpenNotifinaction(false);
  };
  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} />

      <DashboardSidebar
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
      />
      <MainStyle>{children}</MainStyle>

      <Snackbar
        sx={{ textTransform: "capitalize" }}
        open={openNotifinaction}
        onClose={handleClose}
        message={message}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </RootStyle>
  );
}

import PropTypes from "prop-types";
// material
import { alpha, styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Stack,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
// components
import Iconify from "@components/Iconify";
//
import Searchbar from "./Searchbar";
import AccountPopover from "./AccountPopover";
import LanguagePopover from "./LanguagePopover";
import NotificationsPopover from "./NotificationsPopover";
import { useSelector } from "react-redux";
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: "none",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up("lg")]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
})) as typeof AppBar;

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up("lg")]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
})) as typeof Toolbar;

// ----------------------------------------------------------------------

// DashboardNavbar.propTypes = {
//   onOpenSidebar: PropTypes.func,
// };

export default function DashboardNavbar({
  onOpenSidebar,
}: {
  onOpenSidebar: Function;
}) {
  const theme = useTheme();
  const globalState = useSelector((state) => state.globalState);
  let bgColor = "transperent";
  if (globalState?.available_status == "break") {
    // bgColor = "rgba(255, 72, 66, 0.76)";
    bgColor = theme.palette.error.main;
  }
  if (globalState?.available_status == "salah") {
    bgColor = theme.palette.success.main;
  }

  return (
    <RootStyle>
      <ToolbarStyle sx={{ backgroundColor: bgColor }}>
        <IconButton
          onClick={onOpenSidebar}
          sx={{ mr: 1, color: "text.primary", display: { lg: "none" } }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        {/* <Searchbar /> */}
        <Box sx={{ flexGrow: 1 }}>
          {globalState?.available_status != "available" && (
            <Typography
              variant="h2"
              sx={{ textAlign: "center", fontWeight: "bold", color: "white" }}
            >
              {globalState?.available_status?.toUpperCase()}
            </Typography>
          )}
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.5, sm: 1.5 }}
        >
          {/* <LanguagePopover /> */}
          {/* <NotificationsPopover /> */}
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}

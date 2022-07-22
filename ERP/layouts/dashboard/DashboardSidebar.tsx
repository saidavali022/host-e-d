import PropTypes from "prop-types";
import { useEffect } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
// material
import { styled } from "@mui/material/styles";
import {
  Box,
  Link,
  Button,
  Drawer,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
// mocks_
import account from "@_mocks_/account";
// hooks
import useResponsive from "@hooks/useResponsive";
// components
import Logo from "@components/Logo";
import Scrollbar from "@components/Scrollbar";
import NavSection from "@components/NavSectionadmin";
//
import sidebarConfig from "./SidebarConfig";
import { useSelector } from "react-redux";
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useRouter();
  const globalState = useSelector((state) => state.globalState);
  const isDesktop = useResponsive("up", "lg");

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: "inline-flex", mx: "auto" }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <NextLink href="/dashboard/users/profile" passHref>
          <Link underline="none">
            <AccountStyle>
              <Avatar
                src={
                  process.env.NEXT_PUBLIC_HOST + "/" + globalState.profile_img
                }
                alt="photoURL"
              />
              <Box sx={{ ml: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.primary", textTransform: "capitalize" }}
                >
                  {globalState?.firstName} {globalState?.lastName}
                  <br /> {globalState?.Employee_id}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", textTransform: "capitalize" }}
                >
                  {globalState?.role}
                </Typography>
              </Box>
            </AccountStyle>
          </Link>
        </NextLink>
      </Box>

      <NavSection navConfig={sidebarConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.default",
              borderRightStyle: "dashed",
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}

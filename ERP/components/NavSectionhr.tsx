import { useState } from "react";
import PropTypes from "prop-types";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ListSubheader from "@mui/material/ListSubheader";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";

import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import MarkAsUnreadOutlinedIcon from "@mui/icons-material/MarkAsUnreadOutlined";
import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
// material
import { alpha, useTheme, styled } from "@mui/material/styles";
import { Box, List, Collapse } from "@mui/material";
import Iconify from "./Iconify";

// NavItem.propTypes = {
//   item: PropTypes.object,
//   active: PropTypes.func,
// };
interface IItem {
  title: string;
  path: string;
  icon: string;
  info: string;
  children: [IItem];
}
// ----------------------------------------------------------------------

const ListItemStyle = styled((props) => (
  <ListItemButton disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: "relative",
  textTransform: "capitalize",
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.text.secondary,
  "&:before": {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: "none",
    position: "absolute",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// ----------------------------------------------------------------------

function NavItem({ item, active }: { item: IItem; active: Function }) {
  const theme = useTheme();
  const isActiveRoot = active(item.path);
  const { title, path, icon, info, children } = item;
  const [open, setOpen] = useState(isActiveRoot);

  const [openn, setOpenn] = useState(true);

  const activeRootStyle = {
    color: "primary.main",
    fontWeight: "fontWeightMedium",
    bgcolor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity
    ),
    "&:before": { display: "block" },
  };

  const activeSubStyle = {
    color: "text.primary",
    fontWeight: "fontWeightMedium",
  };

  if (children) {
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle),
          }}
        >
          <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
          <ListItemText disableTypography primary={title} />
          {info && info}
          <Iconify
            icon={
              open
                ? "eva:arrow-ios-downward-fill"
                : "eva:arrow-ios-forward-fill"
            }
            sx={{ width: 16, height: 16, ml: 1 }}
          />
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((item: { title: string; path: string }) => {
              const { title, path } = item;
              const isActiveSub = active(path);

              return (
                <NextLink href={path} key={title} passHref>
                  <ListItemStyle
                    sx={{
                      ...(isActiveSub && activeSubStyle),
                    }}
                  >
                    <ListItemIconStyle>
                      <Box
                        component="span"
                        sx={{
                          width: 4,
                          height: 4,
                          display: "flex",
                          borderRadius: "50%",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "text.disabled",
                          transition: (theme) =>
                            theme.transitions.create("transform"),
                          ...(isActiveSub && {
                            transform: "scale(2)",
                            bgcolor: "primary.main",
                          }),
                        }}
                      />
                    </ListItemIconStyle>
                    <ListItemText disableTypography primary={title} />
                  </ListItemStyle>
                </NextLink>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <NextLink href={path} passHref>
      <ListItemStyle
        sx={{
          ...(isActiveRoot && activeRootStyle),
        }}
      >
        <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
        <ListItemText disableTypography primary={title} />
        {info && info}
      </ListItemStyle>
    </NextLink>
  );
}

NavSectionadmin.propTypes = {
  navConfig: PropTypes.array,
};

export default function NavSectionadmin({ navConfig, ...other }: any) {
  const { pathname } = useRouter();

  const [openMenu, setopenMenu] = useState(false);

  // const handleClick = () => {
  //   setopenMenu(!openMenu);
  // };
  const [previousMenu, setpreviousMenu] = useState(0);
  const [selectedMenu, setselectedMenu] = useState(0);
  const handleClick = (index) => {
    setpreviousMenu(index);
    if (selectedMenu == previousMenu) {
      setselectedMenu(0);
    } else {
      setselectedMenu(index);
    }
  };

  const match = (path: string) => pathname == path;

  return (
    <Box {...other}>
      <List disablePadding>
        {navConfig.map((item: any) => (
          <NavItem key={item.title} item={item} active={match} />
        ))}
      </List>

      <ListItemButton
        selected={4 === selectedMenu}
        onClick={() => {
          handleClick(4);
        }}
      >
        <ListItemIcon>
          <BadgeOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Employees" />
        {4 === selectedMenu ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={4 === selectedMenu} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <NextLink href="/hr/employees">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="View Employees" />
            </ListItemButton>
          </NextLink>

          <NextLink href="/hr/employees/shifts">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Add Shifts" />
            </ListItemButton>
          </NextLink>
        </List>
      </Collapse>

      <ListItemButton
        selected={3 === selectedMenu}
        onClick={() => {
          handleClick(3);
        }}
      >
        <ListItemIcon>
          <AddReactionOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="OnBoarding" />
        {3 === selectedMenu ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={3 === selectedMenu} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <NextLink href="/hr/users">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="View OnBoarding" />
            </ListItemButton>
          </NextLink>
          <NextLink href="/hr/users/create">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Paperless OnBoarding" />
            </ListItemButton>
          </NextLink>
        </List>
      </Collapse>

      <ListItemButton
        selected={6 === selectedMenu}
        onClick={() => {
          handleClick(6);
        }}
      >
        <ListItemIcon>
          <AssignmentOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Task" />
        {6 === selectedMenu ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={6 === selectedMenu} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <NextLink href="/hr/task">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Assign Tasks" />
            </ListItemButton>
          </NextLink>
          <NextLink href="/hr/task/get">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Tasks" />
            </ListItemButton>
          </NextLink>
        </List>
      </Collapse>

      <ListItemButton
        selected={1 === selectedMenu}
        onClick={() => {
          handleClick(1);
        }}
      >
        <ListItemIcon>
          <MarkAsUnreadOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="View Letters" />
        {1 === selectedMenu ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={1 === selectedMenu} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <NextLink href="/hr/lettergereration/leaves?type=leave">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Leaves" />
            </ListItemButton>
          </NextLink>
          <NextLink href="/hr/lettergereration/leaves?type=latelogin">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Late Login" />
            </ListItemButton>
          </NextLink>
          <NextLink href="/hr/lettergereration/leaves?type=earlylogout">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Early Logout" />
            </ListItemButton>
          </NextLink>

          <NextLink href="/hr/lettergereration/comadvsuglist?type=complaints">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Complaints" />
            </ListItemButton>
          </NextLink>

          <NextLink href="/hr/lettergereration/comadvsuglist?type=advices_suggestions">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Suggestions" />
            </ListItemButton>
          </NextLink>
        </List>
      </Collapse>

      <ListItemButton
        selected={2 === selectedMenu}
        onClick={() => {
          handleClick(2);
        }}
      >
        <ListItemIcon>
          <HistoryEduOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Generate Letters" />
        {2 === selectedMenu ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={2 === selectedMenu} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <NextLink href="/hr/lettergereration/letter?type=probation ">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Probation Letter" />
            </ListItemButton>
          </NextLink>
          <NextLink href="/hr/lettergereration/letter?type=offer">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Offer Letter" />
            </ListItemButton>
          </NextLink>

          <NextLink href="/hr/lettergereration/letter?type=increment">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Increment Letter" />
            </ListItemButton>
          </NextLink>

          <NextLink href="/hr/lettergereration/letter?type=relieving">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Relieving Letter" />
            </ListItemButton>
          </NextLink>

          <NextLink href="/hr/lettergereration/letter?type=exprience">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Exprience Letter" />
            </ListItemButton>
          </NextLink>

          <NextLink href="/hr/lettergereration/letter?type=others">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Other Letter" />
            </ListItemButton>
          </NextLink>
        </List>
      </Collapse>

      <ListItemButton
        selected={5 === selectedMenu}
        onClick={() => {
          handleClick(5);
        }}
      >
        <ListItemIcon>
          <DateRangeOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Events" />
        {5 === selectedMenu ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={5 === selectedMenu} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <NextLink href="/hr/events/interviews">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Interviews" />
            </ListItemButton>
          </NextLink>
          <NextLink href="/hr/events/calendar">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Calendar" />
            </ListItemButton>
          </NextLink>

          <NextLink href="/hr/users/attendance">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Attendance" />
            </ListItemButton>
          </NextLink>
        </List>
      </Collapse>
    </Box>
  );
}

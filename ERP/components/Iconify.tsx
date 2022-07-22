import * as React from "react";
import PropTypes from "prop-types";
// icons
import { Icon } from "@iconify/react";
// @mui
import { Box } from "@mui/material";

// ----------------------------------------------------------------------

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
};

interface RestProps {}
export default function Iconify({
  icon,
  sx,
  ...other
}: {
  icon: string | React.ReactElement;
  sx?: object;
} & RestProps) {
  return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}

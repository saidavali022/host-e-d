import PropTypes from "prop-types";
import Link from "next/link";
// material
import { Box } from "@mui/material";

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object,
};

export default function Logo({ sx }: any) {
  return (
    <Link href="/" passHref>
      <Box component="img" src="/static/logo.png" sx={{ height: 40, ...sx }} />
    </Link>
  );
}

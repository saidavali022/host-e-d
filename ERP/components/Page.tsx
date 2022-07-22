import PropTypes from "prop-types";
import Head from "next/head";
import { useEffect } from "react";
// material
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
// ----------------------------------------------------------------------

// const Page = forwardRef(({ children, title = '', ...other }, ref) => (
//   <Box ref={ref} {...other}>
//     <Head>
//       <title>{title}</title>
//     </Head>
//     {children}
//   </Box>
// ));

// interface pagePropType = {
//   children: PropTypes.node.isRequired,
//   title: PropTypes.string
// };
const Page = ({ children, title = "", ...other }: any) => {
  const router = useRouter();
  const globalState = useSelector((state) => state.globalState);
  // useEffect(() => {
  //   if (role != globalState.role || !globalState.Employee_id) {
  //     router.push("/");
  //   }
  // }, [role]);

  return (
    <>
      <Box>
        <Head>
          <title>{title}</title>
        </Head>
        {children}
      </Box>
    </>
  );
};
export default Page;

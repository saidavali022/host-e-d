import Getleaves from "pages/components/letter_generation/Getleaves";
import DashboardLayout from "@layouts/dashboard";
function leaves() {
  return <Getleaves role="admin" />;
}

export default leaves;
// leaves.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

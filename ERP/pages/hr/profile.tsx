import Profile from "pages/user/profile";
import React from "react";
import DashboardLayout from "@layouts/hrdashboard";
function profile() {
  return (
    <div>
      <Profile />
    </div>
  );
}

export default profile;
// profile.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

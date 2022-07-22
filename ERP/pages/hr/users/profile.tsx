import Profile from "pages/components/userprofile/Index";
import { Container } from "@mui/material";
import DashboardLayout from "@layouts/hrdashboard";
import Page from "@components/Page";
import { useState, useEffect } from "react";
import axios from "@utils/defaultImports";
import { useRouter } from "next/router";
const profile = () => {
  const router = useRouter();
  const [id, setid] = useState();
  const [userData, setuserData] = useState({});
  useEffect(() => {
    if (router.isReady) {
      setid(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const getUserData = () => {
    axios({
      method: "get",
      url: `${"users/data/" + id}`,
      responseType: "stream",
    }).then(function (response) {
      if (response.data.id) {
        setuserData(response.data);
      } else {
        router.push("./");
      }
    });
  };

  // axios({
  //   method: "get",
  //   url: `${"lettergenaration/letters"}`,
  //   responseType: "stream",
  // }).then(function (response) {
  //   setrowData(response.data);
  // });

  useEffect(() => {
    if (id) {
      getUserData();
    }
  }, [id]);

  return (
    <Page title="User Profile">
      <Container>
        <Profile userData={userData} role={"hr"} />
      </Container>
    </Page>
  );
};

export default profile;
// profile.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

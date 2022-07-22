import Profile from "pages/components/userprofile/Index";
import DashboardLayout from "@layouts/userdashboard";
import Page from "@components/Page";
import { useState, useEffect } from "react";
import axios from "@utils/defaultImports";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
const profile = () => {
  const router = useRouter();
  const [userData, setuserData] = useState({});
  const [letters, setLettersData] = useState({});

  const globalState = useSelector((state) => state.globalState);
  const getUserData = () => {
    axios({
      method: "get",
      url: `${"users/info/" + globalState.Employee_id}`,
      responseType: "stream",
    }).then(function (response) {
      if (response.data.id) {
        setuserData(response.data);
      } else {
        router.push("./");
      }
    });
  };

  const getLetters = () => {
    axios({
      method: "get",
      url: `${"lettergenaration/letters/" + globalState.Employee_id}`,
      responseType: "stream",
    }).then(function (response) {
      if (response.data) {
        setLettersData(response.data);
      } else {
        router.push("./");
      }
    });
  };

  useEffect(() => {
    getUserData();
    getLetters();
  }, []);

  return (
    <Page title="User Profile">
      <Profile userData={userData} lettersData={letters} role={"user"} />
    </Page>
  );
};

export default profile;
// profile.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

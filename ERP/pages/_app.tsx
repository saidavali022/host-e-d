import * as React from "react";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import ThemeConfig from "@theme/index";
import { useRouter } from "next/router";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import DashboardLayout from "@layouts/dashboard";
import UserDashboardLayout from "@layouts/userdashboard";
import HrDashboardLayout from "@layouts/hrdashboard";

import { Provider } from "react-redux";
import store, { persistor } from "../redux/store/store";

import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer_box } from "@utils/defaultImports";
import GlobalStyles from "@theme/globalStyles";
import "@styles/globals.css";

import "@fullcalendar/common/main.css";
import "@fullcalendar/timeline/main.css";
import "@fullcalendar/resource-timeline/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "simplebar-react/dist/simplebar.min.css";

import { useSelector } from "react-redux";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
const MyApp: React.FunctionComponent<AppPropsWithLayout> = (props) => {
  const router = useRouter();
  const path = router.route.split("/");
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;
  const pageLayout = Component.getLayout || ((page) => page);
  // if (Component.getLayout) {
  if (path[1] == "user") {
    // console.log(store);
    // console.log(store.getState);
    return pageLayout(
      <>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SessionProvider session={session}>
              <ThemeConfig>
                <UserDashboardLayout>
                  <Component {...pageProps} />
                  {ToastContainer_box}
                </UserDashboardLayout>
              </ThemeConfig>
            </SessionProvider>
          </PersistGate>
        </Provider>
      </>
    );
  }

  if (path[1] == "admin") {
    return pageLayout(
      <>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SessionProvider session={session}>
              <ThemeConfig>
                <DashboardLayout>
                  <Component {...pageProps} />
                  {ToastContainer_box}
                </DashboardLayout>
              </ThemeConfig>
            </SessionProvider>
          </PersistGate>
        </Provider>
      </>
    );
  }

  if (path[1] == "hr") {
    return pageLayout(
      <>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SessionProvider session={session}>
              <ThemeConfig>
                <HrDashboardLayout>
                  <Component {...pageProps} />
                  {ToastContainer_box}
                </HrDashboardLayout>
              </ThemeConfig>
            </SessionProvider>
          </PersistGate>
        </Provider>
      </>
    );
  }

  return (
    <>
      <Provider store={store}>
        <SessionProvider session={session}>
          <ThemeConfig>
            <Component {...pageProps} />
          </ThemeConfig>
        </SessionProvider>
      </Provider>
    </>
  );
};

export default MyApp;

// component
import Iconify from "@components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <Iconify icon={name} sx={{ width: 22, height: 22 }} />
);

const sidebarConfig = [
  {
    title: "dashboard",
    path: "/hr",
    icon: getIcon("eva:pie-chart-2-fill"),
  },
];

export default sidebarConfig;

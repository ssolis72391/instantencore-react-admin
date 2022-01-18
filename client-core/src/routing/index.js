import Programs from "../pages/Programs";
import Program from "../pages/Program";
import Component from "../components/Component";

const routes = [
  {
    path: "/",
    exact: true,
    name: "home",
    component: Programs,
    backURL: "/",
  },
  {
    path: "/programs",
    exact: true,
    name: "Programs",
    component: Programs,
    backURL: "/programs",
  },
  {
    path: [
      "/program/:programId/page/:pageId/view-all/:componentId",
      "/program/:programId/page/:pageId",
      "/program/:programId",
    ],
    name: "Program",
    component: Program,
    backURL: "/program",
  },
];

export default routes;

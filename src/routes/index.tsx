import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import ContractPage from "../pages/ContractPage";
import EditContractPage from "../pages/EditContractPage";
import NewContractPage from "../pages/NewContractPage/intex";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "contracts/new", element: <NewContractPage /> },
      { path: "contracts/:id", element: <ContractPage /> },
      { path: "contracts/:id/edit", element: <EditContractPage /> },
    ],
  },
]);

export default router;

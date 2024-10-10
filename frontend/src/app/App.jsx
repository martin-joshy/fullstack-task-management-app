import Signup from "../components/authentication/Signup.jsx";
import Login from "../components/authentication/Login.jsx";
import ForgotPasswordForm from "../components/authentication/ForgotPasswordForm.jsx";
import NewPasswordSetForm from "../components/authentication/NewPasswordSetForm.jsx";
import Logout from "@/components/common/Logout.jsx";
import TaskManager from "@/components/task_management/TaskManager.jsx";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/login/forgot-password",
    element: <ForgotPasswordForm />,
  },
  {
    path: "/login/new-password",
    element: <NewPasswordSetForm />,
  },
  {
    path: "/",
    element: <TaskManager />,
  },
  {
    path: "/home",
    element: <TaskManager />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

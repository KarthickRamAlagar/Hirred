import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layouts/app.layout";
import LandingPage from "./pages/Landing";
import OnBoarding from "./pages/OnBoarding";
import JobListing from "./pages/JobListing";
import JobPage from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import SavedJob from "./pages/SavedJob";
import MyJobs from "./pages/MyJobs";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import ProtectedRoutes from "./components/ProtectedRoutes";
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/onboarding",
        element: (
          <ProtectedRoutes>
            <OnBoarding />,
          </ProtectedRoutes>
        ),
      },
      {
        path: "/jobs",
        element: (
          <ProtectedRoutes>
            <JobListing />,
          </ProtectedRoutes>
        ),
      },
      {
        path: "/job/:id",
        element: (
          <ProtectedRoutes>
            <JobPage />,
          </ProtectedRoutes>
        ),
      },
      {
        path: "/post-job",
        element: (
          <ProtectedRoutes>
            <PostJob />,
          </ProtectedRoutes>
        ),
      },
      {
        path: "/saved-jobs",
        element: (
          <ProtectedRoutes>
            <SavedJob />,
          </ProtectedRoutes>
        ),
      },
      {
        path: "/my-jobs",
        element: (
          <ProtectedRoutes>
            <MyJobs />,
          </ProtectedRoutes>
        ),
      },
    ],
  },
]);
const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;

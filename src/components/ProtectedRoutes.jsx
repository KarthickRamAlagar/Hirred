import { useUser } from "@clerk/clerk-react";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { pathname } = useLocation();
  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/?sign-in=true" />;

  // check the user role ( job seekers or job providers)
  if (
    user !== undefined &&
    !user.unsafeMetadata?.role &&
    pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" />;
  }
  return children;
};

export default ProtectedRoutes;

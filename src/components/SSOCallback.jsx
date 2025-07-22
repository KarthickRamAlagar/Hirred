import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const SSOCallback = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/onboarding"); // or wherever post-login should go
    }
  }, [isSignedIn]);

  return <div>Authenticating...</div>;
};

export default SSOCallback;

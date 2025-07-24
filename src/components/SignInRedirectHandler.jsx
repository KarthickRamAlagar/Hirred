import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const SignInRedirectHandler = () => {
  const { clerk } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const listener = ({ type }) => {
      if (type === "userSignedIn") {
        navigate("/onboarding");
      }
    };

    clerk.addListener(listener);

    return () => {
      clerk.removeListener(listener);
    };
  }, [clerk]);

  return null;
};

export default SignInRedirectHandler;

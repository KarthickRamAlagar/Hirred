import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { Laptop2, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OnBoarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(
        user?.unsafeMetadata?.role === "employeer" ? "/post-job" : "/jobs"
      );
    }
  }, [user]);
  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }
  const handleRoleSelection = async (role) => {
    await user
      .update({
        unsafeMetadata: { role },
      })
      .then(() => {
        navigate(role === "employeer" ? "/post-job" : "/jobs");
      })
      .catch((e) => {
        console.log("Error updating Role:", e);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center mt-32">
      <h2 className="gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter">
        I am.....
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
        <Button
          variant="blue"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection("jobseeker")}
        >
          Job Seeker
          <span>
            <Laptop2 className="w-8 h-8 " />
          </span>
        </Button>
        <Button
          variant="destructive"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection("employeer")}
        >
          Employer
          <span>
            <UserCog className="w-8 h-8" />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default OnBoarding;

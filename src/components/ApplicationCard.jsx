import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Boxes,
  BriefcaseBusiness,
  Calendar,
  Download,
  School,
  User2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/useFetch";
import { updateApplicationStatus } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";

const ApplicationCard = ({ application, isJobseeker = false }) => {
  const handleDowwnload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };
  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      id: application.id,
    }
  );
  const handleStatusChange = (status) => {
    fnHiringStatus(status);
  };
  return (
    <Card>
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          <div className="flex gap-3">
            {isJobseeker && application?.job?.company?.logo_url ? (
              <img
                src={application.job.company.logo_url}
                alt="Company Logo"
                className="w-15 h-10"
              />
            ) : (
              <User2 className="text-white-500" />
            )}
            <div className="gradient-title font-bold">
              {isJobseeker
                ? `${application?.job?.title} at ${application?.job?.company?.name}`
                : application?.name}
            </div>
          </div>

          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDowwnload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={22} className="text-blue-500 font-bold" />
            {application?.experience} Years of Experience
          </div>
          <div className="flex gap-2 items-center mr-2">
            <School size={22} className="text-blue-500" />
            <span className="gradient-title font-bold">Education:</span>{" "}
            {application?.education}
          </div>
          <div className="flex gap-2 items-center">
            <Boxes size={22} className="text-blue-500" />
            <span className="gradient-title font-bold">Skills: </span>{" "}
            {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-4">
          <span>
            <Calendar size={20} className="text-white-500" />
          </span>
          <span> {new Date(application?.created_at).toLocaleString()}</span>
        </div>
        {isJobseeker ? (
          <span className="capitalize font-bold">
            Status: {application.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;

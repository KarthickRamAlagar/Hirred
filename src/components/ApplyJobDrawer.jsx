import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/useFetch";
import { applyToJob, checkApplicationStatus } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import { sendNotificationEmail } from "@/lib/emailNotification";
import { useUser, useAuth } from "@clerk/clerk-react";

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be at least 0" })
    .int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      { message: "Only PDF or Word documents are allowed" }
    ),
});

const ApplyJobDrawer = ({ job, fetchJob }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user?.id || !job?.id) return;
      try {
        const token = await getToken();
        const appStatus = await checkApplicationStatus(token, job.id, user.id);

        //  Debug logs for inspection
        console.log("🕵️‍♂️ Debug: job.id =", job.id);
        console.log("🕵️‍♂️ Debug: user.id =", user.id);
        console.log("🕵️‍♂️ Debug: Returned status =", appStatus?.status);

        setApplicationStatus(appStatus?.status || null);
      } catch (err) {
        console.error("❌ Error fetching status:", err);
        setApplicationStatus(null);
      }
    };
    fetchStatus();
  }, [job?.id, user?.id]);

  const OnSubmit = async (data) => {
    const file = data.resume[0];
    const token = await getToken();

    fnApply({
      ...data,
      job_id: job.id,
      jobseeker_id: user.id,
      name: user.fullName || user.firstName,
      status: "applied",
      resume: file,
    }).then(async (createdApp) => {
      const resumeUrl = createdApp?.[0]?.resume || "";
      await new Promise((res) => setTimeout(res, 800));
      fetchJob();
      reset();
      setApplicationStatus("applied");
      setIsDrawerOpen(false);

      sendNotificationEmail({
        type: "application",
        target: "seeker",
        job,
        user,
        resumeUrl,
        playVoice: true,
        applicantDetails: {
          experience: data.experience,
          education: data.education,
          skills: data.skills,
        },
      });
    });
  };

  //  Button Logic
  const isHiringClosed = !job?.isOpen;
  const canApply =
    !isHiringClosed &&
    (applicationStatus === null || applicationStatus === "rejected");

  const buttonLabel = isHiringClosed
    ? "Hiring Closed"
    : applicationStatus === "applied"
    ? "Applied"
    : applicationStatus === "interviewing"
    ? "Interviewing"
    : applicationStatus === "hired"
    ? "Hired"
    : applicationStatus === "rejected"
    ? "ReApply"
    : "Apply";

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={canApply ? "blue" : "destructive"}
          disabled={!canApply}
          className="text-xl font-bold text-gradient-title"
        >
          {buttonLabel}
        </Button>
      </DrawerTrigger>

      {canApply && (
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex justify-between pr-5 text-xl">
              Apply for {job?.title} at {job?.company?.name}
              <span>
                <img src={job?.company?.logo_url} className="h-9 w-19" />
              </span>
            </DrawerTitle>
            <DrawerDescription className="text-lg">
              Please Fill The Form Below.
            </DrawerDescription>
          </DrawerHeader>

          <form
            onSubmit={handleSubmit(OnSubmit)}
            className="flex flex-col gap-4 p-4 pb-0"
          >
            <Input
              type="number"
              placeholder="Years of Experience"
              {...register("experience", { valueAsNumber: true })}
            />
            {errors.experience && (
              <p className="text-red-500">{errors.experience.message}</p>
            )}

            <Input type="text" placeholder="Skills" {...register("skills")} />
            {errors.skills && (
              <p className="text-red-500">{errors.skills.message}</p>
            )}

            {/* <Controller
              name="education"
              control={control}
              defaultValue="Graduate"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex mt-2 mb-2"
                >
                  <Label>Education :</Label>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Graduate" id="graduate" />
                    <Label htmlFor="graduate">Graduate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Post Graduate" id="post-graduate" />
                    <Label htmlFor="post-graduate">Post Graduate</Label>
                  </div>
                </RadioGroup>
              )}
            /> */}
            <Controller
              name="education"
              control={control}
              defaultValue="Graduate"
              render={({ field }) => (
                <div className="flex flex-col w-full">
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Intermediate" id="intermediate" />
                      <Label htmlFor="intermediate">Intermediate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Graduate" id="graduate" />
                      <Label htmlFor="graduate">Graduate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Post Graduate"
                        id="post-graduate"
                      />
                      <Label htmlFor="post-graduate">Post Graduate</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            />

            {errors.education && (
              <p className="text-red-500">{errors.education.message}</p>
            )}

            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              {...register("resume")}
            />
            {errors.resume && (
              <p className="text-red-500">{errors.resume.message}</p>
            )}
            {errorApply?.message && (
              <p className="text-red-500">{errorApply?.message}</p>
            )}
            {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}

            <Button size="lg" variant="blue" disabled={loadingApply}>
              Apply
            </Button>
          </form>

          <DrawerFooter className="mb-5">
            <DrawerClose asChild>
              <Button variant="destructive">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      )}
    </Drawer>
  );
};

export default ApplyJobDrawer;

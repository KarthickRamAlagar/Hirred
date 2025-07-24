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
import { applyToJob } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import { sendNotificationEmail } from "@/lib/emailNotification";

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
      {
        message: "Only PDF or Word documents are allowed",
      }
    ),
});

const ApplyJobDrawer = ({ user, job, applied = false, fetchJob }) => {
  const [isApplied, setIsApplied] = useState(applied);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setIsApplied(applied);
  }, [applied]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  const OnSubmit = async (data) => {
    const file = data.resume[0];

    fnApply({
      ...data,
      job_id: job.id,
      jobseeker_id: user.id,
      name: user.fullName,
      status: "applied",
      resume: file,
    }).then(async (createdApp) => {
      const resumeUrl = createdApp?.resume || "";

      await new Promise((res) => setTimeout(res, 800));
      fetchJob();
      reset();
      setIsApplied(true);
      setIsDrawerOpen(false);

      //  Email and Voice Notifications
      sendNotificationEmail({
        type: "application",
        target: "seeker",
        job,
        user,
        resumeUrl,
        playVoice: true,
      });

      sendNotificationEmail({
        type: "application",
        target: "employer",
        job,
        user,
        resumeUrl,
        playVoice: false,
      });
    });
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen && !isApplied ? "blue" : "destructive"}
          disabled={!job?.isOpen || isApplied}
          className="text-xl font-bold text-gradient-title"
        >
          {job?.isOpen ? (isApplied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex justify-between pr-5 text-xl">
            Apply for {job?.title} at {job?.company?.name}
            <span>
              <img src={job?.company?.logo_url} className="h-9 w-19" />
            </span>
          </DrawerTitle>
          <DrawerDescription className="text-lg flex">
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
            className="flex-1"
            {...register("experience", { valueAsNumber: true })}
          />
          {errors.experience && (
            <p className="text-red-500">{errors.experience.message}</p>
          )}

          <Input
            type="text"
            placeholder="Skills (comma separated)"
            className="flex-1"
            {...register("skills")}
          />
          {errors.skills && (
            <p className="text-red-500">{errors.skills.message}</p>
          )}

          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                {...field}
                className="flex mt-2 mb-2"
              >
                <Label className="space-x-2">Education :</Label>
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
          />
          {errors.education && (
            <p className="text-red-500">{errors.education.message}</p>
          )}

          <Input
            type="file"
            accept=".pdf, .doc, .docx"
            className="flex-1 file:text-gray-500 cursor-pointer"
            {...register("resume")}
          />
          {errors.resume && (
            <p className="text-red-500">{errors.resume.message}</p>
          )}
          {errorApply?.message && (
            <p className="text-red-500">{errorApply?.message}</p>
          )}
          {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}

          <Button size="lg" className="w-full text-lg font-bold">
            Apply
          </Button>
        </form>

        <DrawerFooter className="mb-5">
          <DrawerClose asChild>
            <Button variant="destructive" className="text-lg">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;

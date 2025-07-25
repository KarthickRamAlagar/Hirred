import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, Navigate } from "react-router-dom";
import { State } from "country-state-city";
import MDEditor from "@uiw/react-md-editor";

import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/AddCompanyDrawer";
import useFetch from "@/hooks/useFetch";
import { sendNotificationEmail } from "@/lib/emailNotification";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const navigate = useNavigate();
  const { isLoaded, user } = useUser();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: daataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (daataCreateJob?.length > 0 && companies?.length > 0) {
      const createdJob = daataCreateJob[0];
      const selectedCompany = companies.find(
        (com) => com.id === Number(createdJob.company_id)
      );

      const logo_url = selectedCompany?.logo_url || "";
      const companyObject = {
        ...selectedCompany,
        logo_url: logo_url.startsWith("http")
          ? logo_url
          : `https://yourdomain.com${logo_url}`,
      };

      sendNotificationEmail({
        type: "job_post",
        target: "employer",
        job: {
          ...createdJob,
          company: companyObject,
        },
        user,
      });

      setTimeout(() => {
        navigate("/jobs");
      }, 1000);
    }
  }, [daataCreateJob, companies]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "employeer") {
    return <Navigate to="/jobs" />;
  }

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      employeer_id: user.id,
      isOpen: true,
    });

    const voicePath = "/audio/Notifications_for_job_Post.mp3";
    const audio = new Audio(voicePath);
    console.log("Attempting to play:", voicePath);
    audio.play().catch((err) => {
      console.warn("Audio playback failed:", err.message);
      setTimeout(() => {
        audio.play().catch((err2) => {
          console.warn("Retry failed:", err2.message);
        });
      }, 300);
    });
  };

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form
        className="flex flex-col gap-4 p-4 pb-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Company">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => (
                      <SelectItem key={name} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <AddCompanyDrawer fetchCompanies={fnCompanies} />
        </div>

        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}
        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob.message}</p>
        )}
        {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}

        <Button type="submit" variant="blue" size="lg">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostJob;

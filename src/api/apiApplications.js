import supabaseClient, { supabaseUrl } from "@/utils/supabase";

//  Apply to job ( candidate )
export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.jobseeker_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) throw new Error("Error uploading Resume");

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Application");
  }

  return data;
}

// - Edit Application Status ( recruiter )
export async function updateApplicationStatus(token, { id }, status) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id)
    .select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select(
      `*,
    job:jobs(title, company:companies(name,logo_url)),
    jobseeker:user_profiles(id, fullName, email)
   `
    )
    .eq("jobseeker_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}
export async function checkApplicationStatus(token, job_id, jobseeker_id) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("id, status, created_at")
    .eq("job_id", job_id)
    .eq("jobseeker_id", jobseeker_id)
    .order("created_at", { ascending: false }); 

  if (error) {
    console.error("Error checking application status:", error);
    return null;
  }

  const nonRejected = data?.find((app) => app.status !== "rejected");
  return nonRejected || data?.[0] || null;
}

import supabaseClient from "@/utils/supabase";

export async function getAllSeekers(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "jobseeker");

  if (error) {
    console.error("Error fetching job seekers:", error);
    return [];
  }

  return data;
}

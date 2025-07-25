import emailjs from "@emailjs/browser";

export const sendNotificationEmail = async ({
  type,
  target,
  job,
  user,
  resumeUrl = "",
  playVoice = false,
  applicantDetails = {},
  status = "",
}) => {
  // Use only ONE template for applications and status updates
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_APPLICATION_ID;

  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;


  const isSeeker = target === "seeker";
  const isEmployer = target === "employer";

  const { experience, education, skills } = applicantDetails || {};

  // Company Logo 
  let companyLogoURL = job?.company?.logo_url?.trim() || "";
  if (companyLogoURL.endsWith(".svg") || companyLogoURL.endsWith(".webp")) {
    companyLogoURL = companyLogoURL.replace(/\.(svg|webp)$/, ".png");
  }

  const finalResumeURL = resumeUrl?.trim() || "";
  const jobId = job?.id?.toString() || "unknown";

  // Recipient fields
  const to_email = isSeeker
    ? user?.emailAddresses?.[0]?.emailAddress?.trim()
    : job?.employer?.emailAddresses?.[0]?.emailAddress?.trim() ||
      "fallback@hirred.in";

  const reply_to = isEmployer
    ? user?.emailAddresses?.[0]?.emailAddress?.trim()
    : job?.employer?.emailAddresses?.[0]?.emailAddress?.trim();

  const from_name = isSeeker ? job?.company?.name : user?.fullName;
  const recipient_name = isSeeker
    ? user?.fullName?.trim()
    : job?.employer?.fullName?.trim() || "Employer";

  const from_email = "hirred@gmail.com";

  // Payload for EmailJS
  const payload = {
    to_email,
    from_email,
    reply_to,
    from_name,
    recipient_name,
    job_title: job?.title,
    job_id: jobId,
    description: job?.description,
    responsibilities: job?.requirements,
    company_name: job?.company?.name,
    company_logo_url: companyLogoURL,
    qualifications: job?.description,
    applicant_name: user?.fullName,
    resume_url: finalResumeURL,
    hirred_logo_url:
      "https://raw.githubusercontent.com/KarthickRamAlagar/Hirred/main/public/logo-dark.png",

    //  Dynamic email type
    email_type:
      type === "status_update"
        ? "Application Status Update"
        : isSeeker
        ? "Application Confirmation"
        : "New Applicant",

    is_seeker: isSeeker ? "yes" : "",
    is_employer: isEmployer ? "yes" : "",

    //  Application status
    application_status: type === "status_update" ? status : "Applied",

    // For employer
    ...(isEmployer && {
      applicant_experience: experience?.toString() || "",
      applicant_education: education || "",
      applicant_skills: skills || "",
    }),
  };

  // Sending email
  try {
    await emailjs.send(serviceId, templateId, payload, publicKey);

    // Play sound (optional)
    if (playVoice && typeof Audio !== "undefined") {
      const voicePath =
        type === "status_update"
          ? "/audio/Notifications_for_Status_Update.mp3"
          : "/audio/Notifications_for_Job_Application.mp3";

      const audio = new Audio(voicePath);
      audio.play().catch(() => {
        setTimeout(() => audio.play().catch(() => {}), 300);
      });
    }

    console.log(
      `[EmailJS] Sent ${type} notification to ${target}: ${to_email}`
    );
  } catch (err) {
    console.error("[EmailJS] Failed to send email:", err);
  }
};

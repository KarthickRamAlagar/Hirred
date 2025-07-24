import emailjs from "@emailjs/browser";
export const sendNotificationEmail = async ({
  type,
  target,
  job,
  user,
  resumeUrl = "",
  playVoice = false,
}) => {
  const templateId =
    type === "application"
      ? import.meta.env.VITE_EMAILJS_TEMPLATE_APPLICATION_ID
      : import.meta.env.VITE_EMAILJS_TEMPLATE_JOBPOST_ID;

  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;

  const toEmail =
    user?.emailAddresses?.[0]?.emailAddress || "fallback@hirred.in";
  const recipientName = user?.fullName || "User";

  const isSeeker = target === "seeker";
  const isEmployer = target === "employer";

  const companyLogoURL = job?.company?.logo_url?.startsWith("http")
    ? job.company.logo_url
    : `https://yourdomain.com${job.company.logo_url}`;

  const payload = {
    to_email: toEmail,
    recipient_name: recipientName,
    email_type:
      type === "application"
        ? isSeeker
          ? "Application Confirmation"
          : "New Applicant"
        : isEmployer
        ? "Job Post Confirmation"
        : "New Job Alert",
    job_title: job?.title,
    description: job?.description,
    responsibilities: job?.requirements,
    company_name: job?.company?.name,
    company_logo_url: job?.company?.logo_url,
    qualifications: job?.description,
    applicant_name: user?.fullName,
    resume_url: resumeUrl,
    hirred_logo_url:
      "https://raw.githubusercontent.com/KarthickRamAlagar/Hirred/main/public/logo-dark.png",
    email: toEmail,
    name: recipientName,
    is_seeker: isSeeker ? "yes" : "",
    is_employer: isEmployer ? "yes" : "",
    application_status: "Applied",
  };

  try {
    await emailjs.send(serviceId, templateId, payload, publicKey);

    if (playVoice && typeof Audio !== "undefined") {
      const voicePath =
        type === "application"
          ? "/audio/Notification_for_job_Application.mp3"
          : "/audio/Notifications_for_job_Post.mp3";

      try {
        const audio = new Audio(voicePath);
        audio.play();
      } catch (err) {
        console.error("Voice playback error:", err);
      }
    }

    console.log(`[EmailJS] Sent ${type} notification to ${target}`);
  } catch (err) {
    console.error("[EmailJS] Failed to send email:", err);
  }
};

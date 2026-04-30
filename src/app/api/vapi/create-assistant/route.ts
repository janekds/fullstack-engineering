import { NextRequest, NextResponse } from "next/server";
import { interviewerPrompt } from "@/lib/interviewer-prompt";

interface JobDetails {
  title?: string;
  description?: string;
  company?: string;
  type?: string;
  experience_level?: string;
  location?: string;
  remote?: boolean;
  requirements?: string[];
  salary_min?: number;
  salary_max?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { jobDetails }: { jobDetails: JobDetails } = await request.json();
    console.log("jobDetails in create-assistant", jobDetails);
    if (!jobDetails) {
      return NextResponse.json(
        { error: "jobDetails is required" },
        { status: 400 }
      );
    }

    // Get the Vapi API token from environment variables
    const vapiToken = process.env.NEXT_PUBLIC_VAPI_PRIVATE_KEY;

    if (!vapiToken) {
      return NextResponse.json(
        { error: "Vapi API token not configured" },
        { status: 500 }
      );
    }

    // Customize the prompt with job details
    let customizedPrompt = interviewerPrompt;

    if (jobDetails.title) {
      customizedPrompt = customizedPrompt.replace(
        "{JOB_TITLE}",
        jobDetails.title
      );
    }
    if (jobDetails.description) {
      customizedPrompt = customizedPrompt.replace(
        "{JOB_DESCRIPTION}",
        jobDetails.description
      );
    }
    if (jobDetails.company) {
      customizedPrompt = customizedPrompt.replace(
        "{COMPANY_NAME}",
        jobDetails.company
      );
    }
    if (jobDetails.type) {
      customizedPrompt = customizedPrompt.replace(
        "{JOB_TYPE}",
        jobDetails.type
      );
    }
    if (jobDetails.experience_level) {
      customizedPrompt = customizedPrompt.replace(
        "{EXPERIENCE_LEVEL}",
        jobDetails.experience_level
      );
    }
    if (jobDetails.location) {
      customizedPrompt = customizedPrompt.replace(
        "{LOCATION}",
        jobDetails.location
      );
    }
    if (jobDetails.remote !== undefined) {
      customizedPrompt = customizedPrompt.replace(
        "{REMOTE_ALLOWED}",
        jobDetails.remote ? "Yes" : "No"
      );
    }
    if (jobDetails.requirements && jobDetails.requirements.length > 0) {
      customizedPrompt = customizedPrompt.replace(
        "{SPECIFIC_REQUIREMENTS}",
        jobDetails.requirements.join(", ")
      );
    }
    if (jobDetails.salary_min && jobDetails.salary_max) {
      customizedPrompt = customizedPrompt.replace(
        "{SALARY_MIN}",
        jobDetails.salary_min.toString()
      );
      customizedPrompt = customizedPrompt.replace(
        "{SALARY_MAX}",
        jobDetails.salary_max.toString()
      );
    }

    // Create assistant payload
    const assistantData = {
      name: jobDetails.title
        ? `${jobDetails.title} Interviewer`
        : "General Screening Interviewer",
      firstMessage:
        "Hi! I'm Paige, your AI recruiter. Thanks for taking the time to speak with me today. I'll be conducting a brief 10-15 minute screening to learn about your background and see if this could be a good fit. Shall we get started?",
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: customizedPrompt,
          },
        ],
        temperature: 0.5,
      },
      voice: {
        voiceId: "Paige",
        provider: "vapi",
      },
      transcriber: {
        model: "nova-3",
        language: "en",
        provider: "deepgram",
        endpointing: 150,
      },
      backgroundSound: "office",
      endCallMessage:
        "Thank you for your time today. It was great speaking with you, this was an AI Mock interview, you can view the details once the call ends. Have a great day!",
    };

    // Make request to Vapi API
    const response = await fetch("https://api.vapi.ai/assistant", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vapiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assistantData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Vapi API error:", errorData);
      return NextResponse.json(
        { error: "Failed to create assistant", details: errorData },
        { status: response.status }
      );
    }

    const assistant = await response.json();

    return NextResponse.json({
      success: true,
      assistant_id: assistant.id,
      assistant_name: assistant.name,
    });
  } catch (error) {
    console.error("Error creating assistant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

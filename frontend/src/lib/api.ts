import { AnalysisResponse } from "@/types/analysis";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Submit a resume file and job description for analysis.
 * Returns the full structured AnalysisResponse.
 */
export async function analyzeResume(
  resumeFile: File,
  jobDescription: string,
): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("job_description", jobDescription);

  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    body: formData,
    // Don't set Content-Type — browser sets multipart boundary automatically
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // If JSON parse fails, use the default message
    }
    throw new APIError(errorMessage, response.status);
  }

  return response.json() as Promise<AnalysisResponse>;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}

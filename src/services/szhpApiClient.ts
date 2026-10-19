import axios from 'axios';

/**
 * Axios instance for the housing service. The shell normally injects the
 * auth token and environment base URL; standalone we read the base URL from
 * the Vite env and fall back to the dev proxy at /api.
 */
export const szhpApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Stands in for the signed-in applicant. In the portal this comes from the
 * shell's token; standalone the id is sent in X-Applicant-Id and the service
 * takes it at face value. Not a security control.
 */
export const setApplicantId = (applicantId: string) => {
  szhpApiClient.defaults.headers.common['X-Applicant-Id'] = applicantId;
};

export const isValidResponse = (status?: number) =>
  typeof status === 'number' && status >= 200 && status < 300;

/** The API's {message} for a failed call, or the fallback when there is none. */
export const apiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;
  }
  return fallback;
};

/** Absolute URL for an IAttachment.filePath, which is relative to the API base. */
export const attachmentUrl = (filePath: string) =>
  `${szhpApiClient.defaults.baseURL ?? ''}${filePath}`;

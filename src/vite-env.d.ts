/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the housing API. Defaults to same-origin '/api'. */
  readonly VITE_API_BASE_URL?: string;
  /** Applicant id sent as X-Applicant-Id while there is no sign-in. */
  readonly VITE_DEMO_APPLICANT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

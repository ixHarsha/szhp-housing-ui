/**
 * Request vocabulary, taken from the live MOEI.dbo tables rather than
 * invented. Counts in the comments are the observed row counts, so the
 * dominant values are obvious.
 */

/* ------------------------------------------------------------------ type */

/** MOEI_SZHP_HOUSING_APPLICATIONS.REQUEST_TYPE - single value across 4178 rows. */
export const REQUEST_TYPE_SZHP = 'SZHP';

/**
 * ASSISTANCE_TYPE is stored as a short code on the application row (HA/FA)
 * while MOEI_SZHP_ASSISTANCE_TYPES spells it out. Both are kept so a value
 * read from either place can be labelled.
 */
export const ASSISTANCE_TYPE_OPTIONS = [
  { label: 'Housing Assistance', value: 'HA' }, // 3610
  { label: 'Financial Assistance', value: 'FA' }, // 403
];

export const ASSISTANCE_TYPE_LONG_TO_CODE: Record<string, string> = {
  HOUSING_ASSISTANCE: 'HA',
  FINANCIAL_ASSISTANCE: 'FA',
};

/** ASSISTANCE_PURPOSE on the application; AWARDED_ASSISTANCE_PURPOSE adds the last two. */
export const ASSISTANCE_PURPOSE_OPTIONS = [
  { label: 'Construct', value: 'CONSTRUCT' },
  { label: 'Purchase', value: 'PURCHASE' },
  { label: 'Maintenance', value: 'MAINTENANCE' },
  { label: 'Extension', value: 'EXTENSION' },
  { label: 'Unspecified', value: 'UNSPECIFIED' },
];

/** AID_TYPE is sparse on the application; AWARDED_AID_TYPE is the populated one. */
export const AID_TYPE_OPTIONS = [
  { label: 'Loan', value: 'LOAN' }, // awarded: 3434
  { label: 'Grant', value: 'GRANT' }, // awarded: 710
  { label: 'Housing Fund', value: 'HF' }, // awarded: 16
];

/* --------------------------------------------------------------- housing */

export const HOUSING_OWNERSHIP_OPTIONS = [
  { label: 'Living with Relatives', value: 'WITH_RELATIVES' }, // 2821
  { label: 'Rented', value: 'WITH_RENT' }, // 1084
  { label: 'Owns Dwelling', value: 'OWNS_DWELLING' }, // 174
  { label: "Heirs' Dwelling", value: 'HEIRS_DWELLING' }, // 86
  { label: 'Owns Extension', value: 'OWNS_EXTENSION' }, // 3
];

export const TECHNICAL_CONDITION_OPTIONS = [
  { label: 'Undefined', value: 'UNDEFINED' }, // 3905
  { label: 'Poor', value: 'POOR' },
  { label: 'Average', value: 'AVERAGE' },
  { label: 'Good', value: 'GOOD' },
  { label: 'Worn Out', value: 'WORN_OUT' },
  { label: 'Average - Requires Maintenance', value: 'AVG_REQ_MAINTENANCE' },
];

/* ---------------------------------------------------------------- family */

export const MARITAL_STATUS_OPTIONS = [
  { label: 'Married', value: 'MARRIED' },
  { label: 'Widowed', value: 'WIDOWED' },
  { label: 'Divorced', value: 'DIVORCED' },
  { label: 'Absolute', value: 'ABSOLUTE' },
  { label: 'Single', value: 'SINGLE' },
];

/** MARITAL_CATEGORY drives priority; it is a separate column from MARITAL_STATUS. */
export const MARITAL_CATEGORY_OPTIONS = [
  { label: 'Married', value: 'MARRIED' },
  { label: 'Widow with Children', value: 'WIDOW_WITH_CHILDREN' },
  { label: 'Divorced Woman with Children', value: 'DIVORCED_WOMEN_WITH_CHILDREN' },
  { label: 'Senior Citizens', value: 'SENIOR_CITIZENS' },
  { label: 'Orphan', value: 'ORPHAN' },
  { label: 'Divorced Man with Children', value: 'DIVORCED_MAN_WITH_CHILDREN' },
  { label: 'Widower with Children', value: 'WIDOWER_WITH_CHILDREN' },
  { label: 'Married to a Non-Citizen', value: 'MARRIED_TO_A_NON_CITIZEN' },
  { label: 'People of Determination', value: 'PEOPLE_OF_DETERMINATION' },
  { label: 'Custodial Widow', value: 'CUSTODIAL_WIDOW' },
  { label: 'Senior Citizen over 60', value: 'SENIOR_CITIZEN_OVER_60' },
  { label: 'Single and Lost Parents', value: 'SINGLE_AND_LOST_PARENTS' },
];

/** MOEI_APPLICANT_FAMILY.RELATIONSHIP, as used by the eligibility SQL. */
export const RELATIONSHIP_OPTIONS = [
  { label: 'Wife', value: 'WIFE' },
  { label: 'Son', value: 'SON' },
  { label: 'Daughter', value: 'DAUGHTER' },
  { label: 'Father', value: 'FATHER' },
  { label: 'Mother', value: 'MOTHER' },
  { label: 'Other', value: 'OTHER' },
];

/* -------------------------------------------------------------- emirates */

/**
 * FAMILY_BOOK_EMIRATE holds the numeric emirate code, not a name.
 * Observed: 4 (1169), 3 (990), 6 (944), 2 (418), 7 (403), 5 (249), 1 (4).
 * Abu Dhabi is rare because it runs its own housing programme.
 */
export const EMIRATE_OPTIONS = [
  { label: 'Abu Dhabi', value: '1' },
  { label: 'Dubai', value: '2' },
  { label: 'Sharjah', value: '3' },
  { label: 'Ajman', value: '4' },
  { label: 'Umm Al Quwain', value: '5' },
  { label: 'Ras Al Khaimah', value: '6' },
  { label: 'Fujairah', value: '7' },
];

/* ---------------------------------------------------------------- status */

/**
 * MOEI_SZHP_HOUSING_APPLICATIONS.STATUS as it really appears. The spelling
 * is inconsistent in the data (UNDERREVIEW / UNDER_REVIEW /
 * APPLICATIONUNDERREVIEW all occur) so every variant is mapped rather than
 * normalised, which would hide rows.
 */
export const APPLICATION_STATUS_LABEL: Record<string, string> = {
  APPROVED: 'Approved', // 4126
  UNDERREVIEW: 'Under Review', // 19
  UNDER_REVIEW: 'Under Review', // 3
  APPLICATIONUNDERREVIEW: 'Under Review', // 1
  DRAFT: 'Draft', // 2
  REJECTED_BY_MOEI: 'Rejected by MOEI', // 3
  CANCELLED: 'Cancelled', // 5
  CANCELLED_BY_MOEI: 'Cancelled by MOEI', // 11
  CANCELLED_BY_APPLICANT: 'Cancelled by Applicant', // 3
  APPLICANT_CANCELLATION_INITIATED: 'Applicant Cancellation Initiated', // 3
  ADMIN_CANCELLATION_INITIATED: 'Admin Cancellation Initiated', // 1
  SUBMITTED: 'Submitted',
  RETURNED: 'Returned for Information',
};

/** Kept for the filter dropdown; the variants collapse onto one option. */
export const STATUS_FILTER_OPTIONS = [
  { label: 'All statuses', value: 'ALL' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Submitted', value: 'SUBMITTED' },
  { label: 'Under Review', value: 'UNDERREVIEW' },
  { label: 'Returned for Information', value: 'RETURNED' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected by MOEI', value: 'REJECTED_BY_MOEI' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export const isUnderReview = (status?: string) =>
  status === 'UNDERREVIEW' || status === 'UNDER_REVIEW' || status === 'APPLICATIONUNDERREVIEW';

export const isEditableStatus = (status?: string) =>
  status === 'DRAFT' || status === 'RETURNED';

export const isActionableStatus = (status?: string) =>
  status === 'SUBMITTED' || isUnderReview(status);

/* ------------------------------------------------- workflow (history row) */

/** COMMON_REQUEST_HISTORY.TASK_ACTION */
export const TASK_ACTION = {
  QUEUED: 'QUEUED',
  SUBMIT: 'SUBMIT',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  RETURN: 'RETURN',
} as const;

export type TaskAction = (typeof TASK_ACTION)[keyof typeof TASK_ACTION];

/* ---------------------------------------------------------------- other */

/** MOEI_SZHP_HOUSING_APPLICATIONS.SOURCE - channel the request came from. */
export const SOURCE_INTERNAL_PORTAL = 'InternalPortal'; // 2402
export const SOURCE_WEBSITE = 'Website'; // 1185

/** MOEI_SZHP_CANCEL_APPLICATION */
export const CANCELLATION_TYPE_OPTIONS = [
  { label: 'Applicant Cancellation', value: 'APPLICANT_CANCELLATION' },
  { label: 'Admin Cancellation', value: 'ADMIN_CANCELLATION' },
];

export const CANCEL_REASON_OPTIONS = [
  { label: 'Apply for New Request', value: 'APPLY_FOR_NEW_REQUEST' },
  { label: 'Requested by Applicant', value: 'REQUESTED_BY_APPLICANT' },
  { label: 'Other', value: 'OTHER' },
];

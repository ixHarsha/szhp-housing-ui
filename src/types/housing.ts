/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Request/response shapes for the housing assistance service.
 *
 * These mirror IHousingApplicationDetails / IApplicantDetails /
 * IEmployerDetail / IAttachment from SZHP-micro-ui. Field names and casing
 * are deliberately identical so the payloads stay interchangeable - do not
 * rename anything here without changing the service contract too.
 */

export interface IEmirateDetails {
  id?: string;
  nameEn?: string;
  nameAr?: string;
}

export interface IFamilyDetails {
  id?: string;
  applicant?: string;
  fullNameEn?: string;
  fullNameAr?: string;
  relationship?: string;
  maritalStatus?: string;
  dateOfBirth?: string;
  age?: string;
  gender?: string;
  emiratesId?: string;
  isActive?: boolean;
  specialNeeds?: string;
}

export interface IEmployerDetail {
  id?: string;
  applicant?: string;
  employerName?: string;
  attachments?: any;
  desigination?: string;
  sector?: string;
  workCategory?: string;
  annualIncome?: string;
  createdDate?: string;
  endDate?: string;
  startDate?: string;
  isActive?: string;
}

export interface IAttachment {
  fileName?: string;
  filePath: string;
  attachmentTypeId?: string;
  filePathId?: string;
  source?: string;
  type?: string;
  lastUpdatedDate?: string;
  fileSize?: string;
  requestId?: string;
  id?: string;
  applicantId?: string;
  category?: string;
  fileType?: string;
  status?: string;
}

export interface IApplicantDetails {
  userId?: string;
  uuid?: string;
  emiratesId?: string;
  fullNameEn?: string;
  fullNameAr?: string;
  email?: string;
  phoneNumber?: string;
  mobileNo?: string;
  mobileNo2?: string;
  address?: string;
  poboxNo?: string;
  gender?: string;
  qualification?: string;
  maritialStatus?: string;
  dateOfBirth?: string;
  familyNo?: string;
  townNo?: string;
  emirate?: IEmirateDetails;
  isActive?: boolean;
  createdDate?: string;
  noOfDependent?: string;
  family?: IFamilyDetails[];
  employerDetails?: IEmployerDetail[];
  attachments?: IAttachment[];
  regionAr?: string;
  regionEn?: string;
}

export interface IProcessComment {
  comments?: string;
  actedBy?: string;
  taskName?: string;
  processStatus?: string;
  createdDate?: string;
}

export interface IWorkProgressDetails {
  disbursedPrincipalAmt?: string;
  emiratesId?: string;
  principalInstallmentAmt?: string;
  unDisbursed?: string;
}

export interface IHousingApplicationDetails {
  housingRequestType?: string;
  applicationStatus?: string;
  agreementId?: string;
  applicationId?: string;
  applicationNumber?: string;
  requestType?: string;
  aidType?: string;
  maritalStatus?: string;
  noOfWives: string;
  noOfChildrens: string;
  marriageDate?: string;
  divorceDate?: string;
  spouseDeathDate?: string;
  purposeCategory?: string;
  awardedPurposeCategory?: string;
  fatherDeathDate?: string;
  motherDeathDate?: string;
  region?: string;
  housingOwnership?: string;
  location?: string;
  leaseRentalDate?: string;
  yearsOfStaying?: string;
  landForConstruction?: string;
  assistanceType?: string;
  constructionAreSqFeet?: string;
  assistancePurpose?: string;
  technicalConsition?: string;
  dwellingYOC?: string;
  noOfOccupants?: string;
  noOfRooms?: string;
  noOfCouncils?: string;
  noOfBedRooms?: string;
  noOfBathrooms?: string;
  noOfKitchens?: string;
  receviedHousingAID?: string;
  createdDate?: string;
  fileNo?: string;
  updatedDate?: string;
  status?: string;
  familyBookEmirate?: string;
  maritalCategory?: string;
  processInstanceId?: string;
  referenceNo?: string;
  taskId?: string;
  taskName?: string;
  latitude?: string;
  longitude?: string;
  applicant?: IApplicantDetails;
  pod?: string;
  attachments?: IAttachment[];
  awardedAidAmount?: string;
  awardedAidType?: string;
  awardedAssistanceType?: string;
  awardedMessage?: string;
  awardedAssistancePurpose?: string;
  awardedNoOfBedrooms?: string;
  employerDetails?: IEmployerDetail;
  processComment?: IProcessComment;
  updatedByApplicant?: string;
  source?: string;
  rejectionReason?: string;
  returnReason?: string;
  poboxNo?: string;
  regionAr?: string;
  regionEn?: string;
  workProgressDetails?: IWorkProgressDetails;
  noPrevHousingAsst?: boolean | string;
  isEligibleHF?: boolean;
  eligibility?: string;
}

/** Row shape for the applications list. */
export interface IHousingApplicationSummary {
  applicationId?: string;
  applicationNumber?: string;
  referenceNo?: string;
  applicant?: string;
  applicantNameEn?: string;
  emiratesId?: string;
  requestType?: string;
  aidType?: string;
  assistanceType?: string;
  region?: string;
  regionEn?: string;
  status?: string;
  processStatus?: string;
  awardedAidAmount?: string;
  createdDate?: string;
  updatedDate?: string;
  eligibility?: string;
}

export interface IPagedResponse<T> {
  data: T[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
}

/** COMMON_REQUEST_HISTORY row, as returned for the request timeline. */
export interface IRequestHistory {
  id?: string;
  requestId?: string;
  taskId?: string;
  taskName?: string;
  processType?: string;
  taskAction?: string;
  status?: string;
  processStatus?: string;
  requestStatus?: string;
  comments?: string;
  actedBy?: string;
  acceptedBy?: string;
  isActive?: boolean;
  createdDate?: string;
  completionDate?: string;
}

export interface ILookupItem {
  code: string;
  nameEn: string;
  nameAr?: string;
}

export interface IActionRequest {
  applicationId: string;
  taskAction: string;
  comments?: string;
  awardedAidAmount?: string;
  awardedAidType?: string;
  awardedAssistanceType?: string;
  rejectionReason?: string;
  actedBy?: string;
}

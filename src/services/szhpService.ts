import { szhpApiClient } from './szhpApiClient';
import type {
  IAttachment,
  IHousingApplicationDetails,
  IHousingApplicationSummary,
  ILookupItem,
  IPagedResponse,
  IRequestHistory,
} from 'src/types/housing';

export interface IApplicationListQuery {
  status?: string;
  search?: string;
  pageNo?: number;
  pageSize?: number;
}

export const szhpService = {
  getHousingApplications: async (query: IApplicationListQuery) => {
    const { data } = await szhpApiClient.get<IPagedResponse<IHousingApplicationSummary>>(
      '/housing-applications',
      { params: query },
    );
    return data;
  },

  getHousingApplicationById: async (applicationId: string) => {
    const { data } = await szhpApiClient.get<IHousingApplicationDetails>(
      `/housing-applications/${encodeURIComponent(applicationId)}`,
    );
    return data;
  },

  createHousingApplication: async (payload: IHousingApplicationDetails) => {
    const { data } = await szhpApiClient.post<IHousingApplicationDetails>(
      '/housing-applications',
      payload,
    );
    return data;
  },

  updateHousingApplication: async (applicationId: string, payload: IHousingApplicationDetails) => {
    const { data } = await szhpApiClient.put<IHousingApplicationDetails>(
      `/housing-applications/${encodeURIComponent(applicationId)}`,
      payload,
    );
    return data;
  },

  submitHousingApplication: async (applicationId: string) => {
    const { data } = await szhpApiClient.post<IHousingApplicationDetails>(
      `/housing-applications/${encodeURIComponent(applicationId)}/submit`,
    );
    return data;
  },

  getRequestHistory: async (applicationId: string) => {
    const { data } = await szhpApiClient.get<IRequestHistory[]>(
      `/housing-applications/${encodeURIComponent(applicationId)}/history`,
    );
    return data;
  },

  getAttachments: async (applicationId: string) => {
    const { data } = await szhpApiClient.get<IAttachment[]>(
      `/housing-applications/${encodeURIComponent(applicationId)}/attachments`,
    );
    return data;
  },

  uploadAttachment: async (applicationId: string, attachmentTypeId: string, file: File) => {
    const body = new FormData();
    body.append('attachmentTypeId', attachmentTypeId);
    body.append('file', file);
    const { data } = await szhpApiClient.post<IAttachment>(
      `/housing-applications/${encodeURIComponent(applicationId)}/attachments`,
      body,
      // The client defaults to JSON, which would make axios serialise the FormData.
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data;
  },

  deleteAttachment: async (applicationId: string, attachmentId: string) => {
    await szhpApiClient.delete(
      `/housing-applications/${encodeURIComponent(applicationId)}/attachments/${encodeURIComponent(attachmentId)}`,
    );
  },

  getLookup: async (domain: string) => {
    const { data } = await szhpApiClient.get<ILookupItem[]>(`/lookups/${domain}`);
    return data;
  },
};

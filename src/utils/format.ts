import dayjs from 'dayjs';

export const formatDate = (value?: string | null) =>
  value && dayjs(value).isValid() ? dayjs(value).format('DD/MM/YYYY') : '-';

export const formatDateTime = (value?: string | null) =>
  value && dayjs(value).isValid() ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-';

export const formatAED = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') return '-';
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return `AED ${amount.toLocaleString('en-AE', { maximumFractionDigits: 0 })}`;
};

export const asText = (value?: string | number | null) =>
  value === null || value === undefined || value === '' ? '-' : String(value);

export const formatFileSize = (bytes?: string | number | null) => {
  const size = Number(bytes);
  if (bytes === null || bytes === undefined || bytes === '' || Number.isNaN(size)) return '-';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

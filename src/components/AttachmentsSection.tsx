import { ChangeEvent, KeyboardEvent, useState } from 'react';
import clsx from 'clsx';
import { UploadSimple } from '@phosphor-icons/react';
import { hp } from 'src/utils/cssPrefix';
import AsterikMandatory from 'src/components/ui/AsterikMandatory';
import DocumentList from 'src/components/DocumentList';
import { attachmentUrl } from 'src/services/szhpApiClient';
import {
  ATTACHMENT_EXTENSIONS,
  ATTACHMENT_MAX_BYTES,
  ATTACHMENT_TYPES,
} from 'src/constants/housing';
import type { IAttachment } from 'src/types/housing';

/** A file the applicant has chosen but that is only uploaded when the form is saved. */
export interface PendingAttachment {
  key: string;
  attachmentTypeId: string;
  file: File;
}

interface AttachmentsSectionProps {
  existing: IAttachment[];
  pending: PendingAttachment[];
  onAdd: (attachmentTypeId: string, files: File[]) => void;
  onRemovePending: (key: string) => void;
  onRemoveExisting: (attachmentId: string) => void;
  /** Turned on by a submit attempt, so required-document errors do not show on an untouched form. */
  showRequiredErrors: boolean;
  disabled?: boolean;
}

const ACCEPT = ATTACHMENT_EXTENSIONS.map((ext) => `.${ext}`).join(',');

const checkFile = (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ATTACHMENT_EXTENSIONS.includes(extension)) return 'Only PDF, JPG and PNG files can be uploaded';
  if (file.size > ATTACHMENT_MAX_BYTES) return 'Files must be 5 MB or smaller';
  if (file.size === 0) return 'The file is empty';
  return null;
};

/** One aegov file input per document type. */
const AttachmentsSection = ({
  existing,
  pending,
  onAdd,
  onRemovePending,
  onRemoveExisting,
  showRequiredErrors,
  disabled,
}: AttachmentsSectionProps) => {
  const [fileErrors, setFileErrors] = useState<Record<string, string | null>>({});

  const choose = (attachmentTypeId: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = ''; // so choosing the same file again still fires change
    const rejected = files.map(checkFile).find(Boolean) ?? null;
    setFileErrors((prev) => ({ ...prev, [attachmentTypeId]: rejected }));
    const accepted = files.filter((file) => !checkFile(file));
    if (accepted.length) onAdd(attachmentTypeId, accepted);
  };

  /* The input is hidden by the design system, so the label has to be keyboard-operable. */
  const openPicker = (inputId: string) => (event: KeyboardEvent<HTMLLabelElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      document.getElementById(inputId)?.click();
    }
  };

  return (
    <div className={hp('grid grid-cols-1 md:grid-cols-2 gap-6 mb-8')}>
      {ATTACHMENT_TYPES.map((type) => {
        const inputId = `attachment-${type.value}`;
        const uploaded = existing.filter((a) => a.attachmentTypeId === type.value);
        const chosen = pending.filter((p) => p.attachmentTypeId === type.value);
        const missing = type.required && uploaded.length === 0 && chosen.length === 0;
        const error =
          fileErrors[type.value] ?? (showRequiredErrors && missing ? `${type.label} is required` : null);

        return (
          <div
            key={type.value}
            id={`${inputId}-field`}
            className={clsx('aegov-form-control aegov-file-input-control', error && 'control-error')}
          >
            <label htmlFor={inputId}>
              {type.label}
              {type.required ? <AsterikMandatory /> : null}
            </label>
            <label
              htmlFor={inputId}
              tabIndex={disabled ? -1 : 0}
              role='button'
              aria-disabled={disabled}
              onKeyDown={openPicker(inputId)}
              className={clsx('file-input-label aegov-btn btn-sm', disabled && 'file-input-disabled')}
            >
              <UploadSimple size={18} aria-hidden /> Choose file
            </label>
            <input
              type='file'
              id={inputId}
              accept={ACCEPT}
              multiple
              disabled={disabled}
              onChange={choose(type.value)}
            />
            <div className={hp('text-sm text-[#8D8E90] mt-2')}>PDF, JPG or PNG, up to 5 MB</div>

            {uploaded.length || chosen.length ? (
              <div className='file-input-summary'>
                <DocumentList
                  disabled={disabled}
                  items={[
                    ...uploaded.map((a) => ({
                      key: `existing:${a.id}`,
                      fileName: a.fileName ?? 'document',
                      fileSize: a.fileSize,
                      fileType: a.fileType,
                      href: attachmentUrl(a.filePath),
                    })),
                    ...chosen.map((p) => ({
                      key: `pending:${p.key}`,
                      fileName: p.file.name,
                      fileSize: p.file.size,
                      fileType: p.file.type,
                      pending: true,
                    })),
                  ]}
                  onRemove={(key) => {
                    const [kind, id] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
                    if (kind === 'existing') onRemoveExisting(id);
                    else onRemovePending(id);
                  }}
                />
              </div>
            ) : null}

            {error ? (
              <span className='error-message'>
                <strong>ERROR</strong> {error}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default AttachmentsSection;

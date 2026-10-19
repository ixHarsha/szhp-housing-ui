import { FileImage, FilePdf, Trash } from '@phosphor-icons/react';
import { hp } from 'src/utils/cssPrefix';
import { formatFileSize } from 'src/utils/format';
import Button from 'src/components/ui/Button';

export interface DocumentItem {
  key: string;
  fileName: string;
  fileSize?: string | number;
  fileType?: string;
  /** Download link; absent for a file that has not been uploaded yet. */
  href?: string;
  pending?: boolean;
}

const isPdf = (item: DocumentItem) =>
  item.fileType === 'application/pdf' || item.fileName.toLowerCase().endsWith('.pdf');

/**
 * One row per document. Rows carry file-input-summary-item so that inside an
 * aegov-file-input-control they pick up the design-system summary layout.
 */
const DocumentList = ({
  items,
  onRemove,
  disabled,
}: {
  items: DocumentItem[];
  onRemove?: (key: string) => void;
  disabled?: boolean;
}) => (
  <>
    {items.map((item) => (
      <div key={item.key} className={`file-input-summary-item ${hp('flex flex-wrap items-center gap-3')}`}>
        {isPdf(item) ? (
          <FilePdf size={22} color='#92722A' aria-hidden />
        ) : (
          <FileImage size={22} color='#92722A' aria-hidden />
        )}
        {item.href ? (
          <a
            href={item.href}
            target='_blank'
            rel='noopener noreferrer'
            className={hp('text-primary-600 underline font-medium break-all')}
          >
            {item.fileName}
          </a>
        ) : (
          <span className={hp('text-[#323438] font-medium break-all')}>{item.fileName}</span>
        )}
        <span className={hp('text-sm text-[#8D8E90]')}>{formatFileSize(item.fileSize)}</span>
        {item.pending ? (
          <span className={hp('text-sm text-[#8D8E90] italic')}>Uploads when you save</span>
        ) : null}
        {onRemove ? (
          <Button
            type='button'
            styleVariant='link'
            sizeVariant='xs'
            disabled={disabled}
            aria-label={`Remove ${item.fileName}`}
            onClick={() => onRemove(item.key)}
          >
            <Trash size={16} aria-hidden /> Remove
          </Button>
        ) : null}
      </div>
    ))}
  </>
);

export default DocumentList;

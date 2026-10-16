import { Tag } from 'antd';

type StatusColorMap = Record<string, string[]>;

/**
 * Local stand-in for ui/Status. The hosted component resolves its label and
 * its colour map from the interface configuration service; standalone we keep
 * the same fallback map and the same antd Tag rendering.
 */
const statusColorMap: StatusColorMap = {
  blue: ['new_application', 'submitted', 'draft'],
  orange: ['more', 'under', 'closed', 'returned', 'pending'],
  red: ['inactive', 'expired', 'rejected', 'cancelled', 'suspend'],
  green: ['active', 'approved', 'complete', 'issued', 'eligible'],
};

const getStatusColor = (status: string): string => {
  try {
    const lowerStatus = status?.toLowerCase();
    for (const [color, keywords] of Object.entries(statusColorMap)) {
      if (keywords?.some((keyword) => lowerStatus?.includes(keyword?.toLowerCase()?.trim()))) {
        return color;
      }
    }
  } catch {
    // fall through to the default
  }
  return 'gold';
};

type StatusProps = {
  labelKey?: string;
  label?: string;
  withStyles?: boolean;
  className?: string;
  showTag?: boolean;
};

const Status = ({
  labelKey,
  label,
  withStyles = true,
  className,
  showTag = true,
}: StatusProps) => {
  const text = label || labelKey || '';

  if (!withStyles) {
    return <>{text}</>;
  }

  return showTag ? (
    <Tag className={className} color={getStatusColor(labelKey || text)}>
      {text}
    </Tag>
  ) : (
    <div style={{ color: getStatusColor(labelKey || text) }}>{text}</div>
  );
};

export default Status;

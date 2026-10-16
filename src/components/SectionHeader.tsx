import { ReactNode } from 'react';
import { hp } from 'src/utils/cssPrefix';

/** The JobDetails heading treatment, reusable above any block of content. */
const SectionHeader = ({ title, action }: { title: string; action?: ReactNode }) => {
  return (
    <div className={hp('flex items-center pb-4')}>
      <div className={hp('text-xl text-primary-600 font-semibold ')}>{title}</div>
      <div className={hp('border-t text-[#92722A] opacity-15 flex-grow mx-4')}></div>
      {action}
    </div>
  );
};

export default SectionHeader;

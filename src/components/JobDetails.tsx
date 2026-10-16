import { hp } from 'src/utils/cssPrefix';

interface JobDetail {
  title: string;
  value: string;
}

interface JobDetailsProps {
  header: string;
  details: JobDetail[];
}

/**
 * Section header with the gold rule, then a three-up label/value grid.
 * Kept identical to the SZHP housing-assistance-request component.
 */
const JobDetails = ({ header, details }: JobDetailsProps) => {
  return (
    <div>
      <div className={hp('flex items-center pb-4')}>
        <div className={hp('text-xl text-primary-600 font-semibold ')}>{header}</div>
        <div className={hp('border-t text-[#92722A] opacity-15 flex-grow mx-4')}></div>
      </div>
      <div className={hp('flex flex-wrap')}>
        {details?.map((detail, index) => (
          <div key={index} className={hp('w-full  md:w-1/3  mb-4')}>
            <div className={hp('text-[#8D8E90]')}>{detail?.title}</div>
            <div className={hp('text-[#323438] font-medium')}>{detail?.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobDetails;

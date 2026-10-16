import { Link } from 'react-router-dom';

type itemFeedType = {
  label: string;
  path: string;
};

type BreadcrumbsProps = {
  itemFeed: itemFeedType[];
  homePath?: string;
  homeTitle?: string;
  showHome?: boolean;
};

/** Local stand-in for ui/Breadcrumbs, same aegov-breadcrumb markup. */
const Breadcrumbs = ({
  itemFeed,
  homePath = '/housing-requests',
  homeTitle = 'Home',
  showHome = true,
}: BreadcrumbsProps) => {
  return (
    <nav aria-label='Breadcrumb' className='aegov-breadcrumb with-seperator'>
      <ol>
        {showHome && (
          <li>
            <Link to={homePath}>
              <svg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
                <rect width='256' height='256' fill='none' />
                <path
                  d='M152,208V160a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v48a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V115.54a8,8,0,0,1,2.62-5.92l80-75.54a8,8,0,0,1,10.77,0l80,75.54a8,8,0,0,1,2.62,5.92V208a8,8,0,0,1-8,8H160A8,8,0,0,1,152,208Z'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='16'
                />
              </svg>
              {homeTitle}
            </Link>
          </li>
        )}
        {itemFeed?.map((item, index) => {
          const isLast = index === itemFeed.length - 1;
          return (
            <li key={item.label} aria-current={isLast ? 'page' : undefined}>
              {isLast || !item.path ? <span>{item.label}</span> : <Link to={item.path}>{item.label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

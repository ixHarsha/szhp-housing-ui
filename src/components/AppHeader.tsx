import { NavLink } from 'react-router-dom';
import { hp } from 'src/utils/cssPrefix';

/**
 * Stands in for the shell's DesktopHeader. The real external form renders as a
 * federated remote inside moei-ui-shared and inherits that chrome; standalone
 * it needs its own.
 */
const AppHeader = () => {
  return (
    <header className={hp('bg-primary-600 text-white')}>
      <div className={hp('container mx-auto px-4 py-3 flex flex-wrap items-center gap-4')}>
        <div className={hp('flex items-center gap-3')}>
          <svg width='34' height='34' viewBox='0 0 32 32' aria-hidden='true'>
            <rect width='32' height='32' rx='5' fill='#ffffff' fillOpacity='0.15' />
            <path d='M16 7l9 7.2V26h-6v-7h-6v7H7V14.2L16 7z' fill='#ffffff' />
          </svg>
          <div>
            <div className={hp('font-semibold leading-tight')}>Housing Assistance Request</div>
            <div className={hp('text-xs opacity-80 uppercase tracking-wide')}>
              Sheikh Zayed Housing Programme
            </div>
          </div>
        </div>

        <div className={hp('flex-grow')} />

        <nav className={hp('flex gap-2')} aria-label='Main'>
          <NavLink
            to='/housing-requests'
            end
            className={({ isActive }) =>
              hp(`px-3 py-2 rounded text-sm ${isActive ? 'bg-white/20 font-semibold' : 'opacity-85'}`)
            }
          >
            My Requests
          </NavLink>
          <NavLink
            to='/housing-requests/new'
            className={({ isActive }) =>
              hp(`px-3 py-2 rounded text-sm ${isActive ? 'bg-white/20 font-semibold' : 'opacity-85'}`)
            }
          >
            New Request
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;

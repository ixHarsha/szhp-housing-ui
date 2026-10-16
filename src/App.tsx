import { Navigate, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AppHeader from 'src/components/AppHeader';
import HousingApplicationsList from 'src/pages/HousingApplicationsList';
import HousingApplicationDetails from 'src/pages/HousingApplicationDetails';
import HousingAssistanceForm from 'src/pages/HousingAssistanceForm';
import { hp } from 'src/utils/cssPrefix';

/** antd tokens aligned with the SZHP gold primary (#92722a). */
const antTheme = {
  token: {
    colorPrimary: '#92722a',
    colorLink: '#92722a',
    borderRadius: 4,
    fontFamily: 'inherit',
  },
};

function App() {
  return (
    <ConfigProvider theme={antTheme}>
      <div className={hp('min-h-screen flex flex-col bg-white')}>
        <AppHeader />
        <main className={hp('container mx-auto px-4 py-6 flex-grow w-full')}>
          <Routes>
            <Route path='/' element={<Navigate to='/housing-requests' replace />} />
            <Route path='/housing-requests' element={<HousingApplicationsList />} />
            <Route path='/housing-requests/new' element={<HousingAssistanceForm />} />
            <Route path='/housing-requests/:applicationId' element={<HousingApplicationDetails />} />
            <Route path='/housing-requests/:applicationId/edit' element={<HousingAssistanceForm />} />
            <Route path='*' element={<Navigate to='/housing-requests' replace />} />
          </Routes>
        </main>
        <footer className={hp('border-t border-[#f1f1f1] py-4')}>
          <div className={hp('container mx-auto px-4 text-sm text-[#8D8E90]')}>
            Demonstration environment - no sign-in.
          </div>
        </footer>
      </div>
    </ConfigProvider>
  );
}

export default App;

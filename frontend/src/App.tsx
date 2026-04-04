import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DateProvider } from '@/context/DateContext';
import MainLayout from '@/layouts/MainLayout';
import Dashboard from '@/pages/Dashboard';
import LogQuery from '@/pages/LogQuery';
import LogStatistics from '@/pages/LogStatistics';
import SystemSettings from '@/pages/SystemSettings';
import BusinessSystems from '@/pages/BusinessSystems';
import ReportOverview from '@/pages/ReportOverview';
import ReportDetail from '@/pages/ReportDetail';

function App() {
  return (
    <BrowserRouter>
      <DateProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="query" element={<LogQuery />} />
            <Route path="statistics" element={<LogStatistics />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>
          <Route path="/systems" element={<BusinessSystems />} />
          <Route path="/overview" element={<ReportOverview />} />
          <Route path="/report/:systemId" element={<ReportDetail />} />
        </Routes>
      </DateProvider>
    </BrowserRouter>
  );
}

export default App;

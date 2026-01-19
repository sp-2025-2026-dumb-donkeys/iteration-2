import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Medications from './pages/Medications';
import DoctorVisits from './pages/DoctorVisits';
import Settings from './pages/Settings';
import SubscriptionGuard from './components/SubscriptionGuard';

function App() {
  return (
    <SubscriptionGuard>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/visits" element={<DoctorVisits />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </SubscriptionGuard>
  );
}

export default App;

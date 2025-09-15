import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppLayout from './components/Layout';
import AIAssistant from './components/AIAssistant';
import SimpleDashboard from './pages/SimpleDashboard';
import PDTForecastPage from './pages/PDTForecastPage';
import PNDataPage from './pages/PNDataPage';
import ForecastTemplatePage from './pages/ForecastTemplatePage';
import PNFastEntry from './pages/PNFastEntry';
import PNAuditPage from './pages/PNAuditPage';
// import ForecastEntry from './pages/ForecastEntry';
import 'antd/dist/reset.css';

const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 8,
    colorBgContainer: '#ffffff',
  },
  components: {
    Card: {
      borderRadiusLG: 12,
    },
    Button: {
      borderRadius: 6,
    },
  },
};

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <Router basename={import.meta.env.PROD ? '/agent' : '/'}>
        <AppLayout>
          <Routes>
            <Route path="/" element={<SimpleDashboard />} />
            <Route path="/pn-fast-entry" element={<PNFastEntry />} />
            <Route path="/pn-audit" element={<PNAuditPage />} />
            <Route path="/pdt-forecast" element={<PDTForecastPage />} />
            <Route path="/pn-data" element={<PNDataPage />} />
            <Route path="/forecast-template" element={<ForecastTemplatePage />} />
            {/* <Route path="/forecast-entry" element={<ForecastEntry />} /> */}
          </Routes>
          <AIAssistant />
        </AppLayout>
      </Router>
    </ConfigProvider>
  );
};

export default App;
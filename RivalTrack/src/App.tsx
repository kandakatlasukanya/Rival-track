import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SelectCompanyPage } from './pages/SelectCompanyPage';
import { AppLayout } from './components/common/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CompetitorsPage } from './pages/CompetitorsPage';
import { ProductsPage } from './pages/ProductsPage';
import { PricingOffersPage } from './pages/PricingOffersPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { InsightsPage } from './pages/InsightsPage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public & Onboarding Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/select-company" element={<SelectCompanyPage />} />

          {/* Authenticated / Core Platform Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/competitors" element={<CompetitorsPage />} />
            {/* /products = Comparisons in navigation */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/pricing" element={<PricingOffersPage />} />
            {/* Campaigns / Ad Intel is integrated sub-section */}
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

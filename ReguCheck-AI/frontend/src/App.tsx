import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewInspectionPage } from './pages/NewInspectionPage';
import { ProductAnalysisPage } from './pages/ProductAnalysisPage';
import { OCRResultsPage } from './pages/OCRResultsPage';
import { DetectedInfoPage } from './pages/DetectedInfoPage';
import { ClassificationPage } from './pages/ClassificationPage';
import { ComplianceAnalysisPage } from './pages/ComplianceAnalysisPage';
import { IssueDetailsPage } from './pages/IssueDetailsPage';
import { ComplianceReportPage } from './pages/ComplianceReportPage';
import { InspectionHistoryPage } from './pages/InspectionHistoryPage';
import { RegulationsPage } from './pages/RegulationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Standalone Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Authenticated Application Layout Pages */}
        <Route element={<AppLayout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* 8-Step Inspection Workflow */}
          <Route path="/inspect/new" element={<NewInspectionPage />} />
          <Route path="/inspect/analysis" element={<ProductAnalysisPage />} />
          <Route path="/inspect/ocr" element={<OCRResultsPage />} />
          <Route path="/inspect/detected-info" element={<DetectedInfoPage />} />
          <Route path="/inspect/classification" element={<ClassificationPage />} />
          <Route path="/inspect/compliance" element={<ComplianceAnalysisPage />} />
          <Route path="/inspect/issues" element={<IssueDetailsPage />} />
          <Route path="/inspect/report" element={<ComplianceReportPage />} />

          {/* Historical & Knowledge Base Modules */}
          <Route path="/history" element={<InspectionHistoryPage />} />
          <Route path="/regulations" element={<RegulationsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

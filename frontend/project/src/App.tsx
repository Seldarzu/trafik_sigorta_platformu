// src/App.tsx
import { useMemo } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { Page, Quote } from './types';

import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import QuoteForm from './components/QuoteForm/QuoteForm';
import QuoteList from './components/QuoteList/QuoteList';
import CustomerManagement from './components/Customers/CustomerManagement';
import Analytics from './components/Analytics/Analytics';
import PolicyList from './components/Policies/PolicyList';
import Settings from './components/Settings/Settings';

// 🔁 Yeni: Component tabanlı karşılaştırma route'u
import InsuranceComparisonRoute from './routes/InsuranceComparisonRoute';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage: Page = useMemo(() => {
    const p = location.pathname;
    if (p === '/' || p.startsWith('/dashboard')) return 'dashboard';
    if (p.startsWith('/yeni-teklif')) return 'new-quote';
    if (p.startsWith('/teklifler')) return 'quotes';
    if (p.startsWith('/musteriler')) return 'customers';
    if (p.startsWith('/analitik')) return 'analytics';
    if (p.startsWith('/policeler')) return 'policies';
    if (p.startsWith('/settings')) return 'settings';
    return 'dashboard';
  }, [location.pathname]);

  const pageToPath = (page: Page) => {
    switch (page) {
      case 'dashboard': return '/';
      case 'new-quote': return '/yeni-teklif';
      case 'quotes':    return '/teklifler';
      case 'customers': return '/musteriler';
      case 'analytics': return '/analitik';
      case 'policies':  return '/policeler';
      case 'settings':  return '/settings';
      default:          return '/';
    }
  };

  const handleHeaderNavigate = (page: Page) => {
    navigate(pageToPath(page));
  };

  const onQuoteCreated = (quote: Quote) => {
    navigate(`/insurance/${quote.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <Header currentPage={currentPage} onPageChange={handleHeaderNavigate} />

      <main>
        <Routes>
          <Route path="/" element={<Dashboard onPageChange={handleHeaderNavigate} />} />
          <Route path="/dashboard" element={<Dashboard onPageChange={handleHeaderNavigate} />} />

          <Route
            path="/yeni-teklif"
            element={
              <QuoteForm
                onBack={() => navigate('/')}
                onQuoteCreated={onQuoteCreated}
              />
            }
          />

          <Route
            path="/teklifler"
            element={
              <QuoteList
                onQuoteSelect={(q) => navigate(`/insurance/${q.id}`)}
              />
            }
          />

          {/* 🔁 Karşılaştırma: sayfa yerine component container */}
          <Route path="/insurance/:quoteId" element={<InsuranceComparisonRoute />} />

          <Route path="/musteriler" element={<CustomerManagement />} />
          <Route path="/analitik" element={<Analytics />} />
          <Route path="/policeler" element={<PolicyList />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

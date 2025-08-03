// src/App.tsx
import  { useState } from 'react';
import { Page, Quote } from './types';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import QuoteForm from './components/QuoteForm/QuoteForm';
import QuoteList from './components/QuoteList/QuoteList';
import QuoteDetails from './components/QuoteDetails/QuoteDetails';
import CustomerManagement from './components/Customers/CustomerManagement';
import Analytics from './components/Analytics/Analytics';
import Settings from './components/Settings/Settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const changePage = (page: Page) => {
    setCurrentPage(page);
    setSelectedQuote(null);
    setShowDetails(false);
  };

  const onQuoteCreated = (_q: Quote) => changePage('quotes');
  const onQuoteSelect  = (q: Quote) => { setSelectedQuote(q); setShowDetails(true); };
  const backFromDetails = () => { setShowDetails(false); setSelectedQuote(null); };
  const editFromDetails = () => { setShowDetails(false); changePage('new-quote'); };

  const renderMain = () => {
    if (showDetails && selectedQuote) {
      return (
        <QuoteDetails
          quote={selectedQuote}
          onBack={backFromDetails}
          onEdit={editFromDetails}
        />
      );
    }
    switch (currentPage) {
      case 'dashboard':  return <Dashboard onPageChange={changePage} />;
      case 'new-quote':  return <QuoteForm onBack={() => changePage('dashboard')} onQuoteCreated={onQuoteCreated} />;
      case 'quotes':     return <QuoteList onQuoteSelect={onQuoteSelect} />;
      case 'customers':  return <CustomerManagement />;
      case 'analytics':  return <Analytics />;
      case 'settings':   return <Settings />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <Header currentPage={currentPage} onPageChange={changePage} />
      <main>{renderMain()}</main>
    </div>
  );
}

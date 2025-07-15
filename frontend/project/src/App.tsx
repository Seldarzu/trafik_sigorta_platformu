import  { useState } from 'react';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import QuoteForm from './components/QuoteForm/QuoteForm';
import QuoteList from './components/QuoteList/QuoteList';
import QuoteDetails from './components/QuoteDetails/QuoteDetails';
import CustomerManagement from './components/Customers/CustomerManagement';
import Analytics from './components/Analytics/Analytics';
import Settings from './components/Settings/Settings';
import { Quote } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showQuoteDetails, setShowQuoteDetails] = useState(false);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setSelectedQuote(null);
    setShowQuoteDetails(false);
  };

  const handleQuoteCreated = (quote: Quote) => {
    // In a real app, this would save to backend
    console.log('Quote created:', quote);
    // Redirect to quote list or show success message
    setCurrentPage('quotes');
  };

  const handleQuoteSelect = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowQuoteDetails(true);
  };

  const handleQuoteDetailsBack = () => {
    setShowQuoteDetails(false);
    setSelectedQuote(null);
  };

  const handleQuoteEdit = () => {
    // In a real app, this would populate the form with existing data
    setShowQuoteDetails(false);
    setCurrentPage('new-quote');
  };

  const renderCurrentPage = () => {
    // Show quote details if a quote is selected
    if (showQuoteDetails && selectedQuote) {
      return (
        <QuoteDetails
          quote={selectedQuote}
          onBack={handleQuoteDetailsBack}
          onEdit={handleQuoteEdit}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={handlePageChange} />;
      case 'new-quote':
        return (
          <QuoteForm
            onBack={() => handlePageChange('dashboard')}
            onQuoteCreated={handleQuoteCreated}
          />
        );
      case 'quotes':
        return <QuoteList onQuoteSelect={handleQuoteSelect} />;
      case 'customers':
        return <CustomerManagement onPageChange={handlePageChange} />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <Header currentPage={currentPage} onPageChange={handlePageChange} />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;
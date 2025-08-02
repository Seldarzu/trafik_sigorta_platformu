import { useState } from 'react'
import { Page, Quote } from './types'
import Header from './components/Layout/Header'
import Dashboard from './components/Dashboard/Dashboard'
import QuoteForm from './components/QuoteForm/QuoteForm'
import QuoteList from './components/QuoteList/QuoteList'
import QuoteDetails from './components/QuoteDetails/QuoteDetails'
import CustomerManagement from './components/Customers/CustomerManagement'
import Analytics from './components/Analytics/Analytics'
import Settings from './components/Settings/Settings'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [selectedQuote, setSelectedQuote] = useState<Quote|null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const handlePageChange = (p:Page) => { setCurrentPage(p); setSelectedQuote(null); setShowDetails(false) }
  const handleQuoteCreated = (q:Quote) => { setSelectedQuote(q); setCurrentPage('quotes'); setShowDetails(false) }
  const handleSelect = (q:Quote) => { setSelectedQuote(q); setShowDetails(true) }
  const render = () => {
    if (showDetails && selectedQuote) return <QuoteDetails quote={selectedQuote} onBack={()=>setShowDetails(false)} onEdit={()=>setCurrentPage('new-quote')} />
    switch(currentPage) {
      case 'dashboard': return <Dashboard onPageChange={handlePageChange} />
      case 'new-quote': return <QuoteForm onBack={()=>handlePageChange('dashboard')} onQuoteCreated={handleQuoteCreated} />
      case 'quotes': return <QuoteList onQuoteSelect={handleSelect} />
      case 'customers': return <CustomerManagement />
      case 'analytics': return <Analytics />
      case 'settings': return <Settings />
      default: return <Dashboard onPageChange={handlePageChange} />
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <Header currentPage={currentPage} onPageChange={handlePageChange} />
      <main>{render()}</main>
    </div>
  )
}

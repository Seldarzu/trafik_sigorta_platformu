// src/components/QuoteForm/QuoteSummary.tsx
import React from 'react';
import quoteService from '../../services/QuoteService';
import type { CreateQuoteRequest, Quote } from '../../types';

type Props = {
  customerId: string;
  vehicleId: string;
  driverId: string;
  agentId: string;
  onQuoteCreated: (q: Quote) => void; // <-- parent'tan gelecek
};

const QuoteSummary: React.FC<Props> = ({
  customerId,
  vehicleId,
  driverId,
  agentId,
  onQuoteCreated,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGetOffers = async () => {
    try {
      setSubmitting(true);
      setError(null);

      if (!vehicleId) { setError('vehicleId gerekli'); return; }
      if (!driverId) { setError('driverId gerekli'); return; }

      const payload: CreateQuoteRequest = {
        customerId,
        vehicleId,
        driverId,
        agentId,
        // istersen riskScore / coverageAmount / premiumAmount ekleyebilirsin
      };

      const q = await quoteService.createQuote(payload);
      onQuoteCreated(q); // <-- Router yerine üst seviyeye ver, App zaten compare'a geçiyor
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Teklif oluşturulamadı');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        onClick={handleGetOffers}
        disabled={submitting}
        className="px-6 py-3 rounded bg-blue-600 text-white"
      >
        {submitting ? 'Hesaplanıyor…' : 'Teklif Al'}
      </button>
    </div>
  );
};

export default QuoteSummary;

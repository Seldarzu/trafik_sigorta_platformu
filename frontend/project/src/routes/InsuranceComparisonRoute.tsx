import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { InsuranceComparison } from '../components/InsuranceComparison';
import quoteService from '../services/QuoteService';
import type { Quote } from '../types';

export default function InsuranceComparisonRoute() {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        if (!quoteId) return;
        const q = await quoteService.getQuote(quoteId);
        if (on) setQuote(q);
      } catch (e: any) {
        if (on) setErr(e?.response?.data?.message || e?.message || 'Teklif yüklenemedi');
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => { on = false; };
  }, [quoteId]);

  if (loading) return <div className="p-8">Yükleniyor…</div>;
  if (err) return <div className="p-8 text-red-600">{err}</div>;
  if (!quote) return null;

  return (
    <InsuranceComparison
      quote={quote}
      onBack={() => navigate('/teklifler')}
      onCompanySelect={(_companyId, updatedQuote) => {
        // 👇 seçimden sonra sayfa değiştirmiyoruz; sadece yerel state’i güncelliyoruz
        setQuote(updatedQuote);
      }}
    />
  );
}

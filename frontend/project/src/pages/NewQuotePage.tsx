import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { CreateQuoteRequest, QuoteResponse, CustomerResponse } from '../types';

export default function NewQuotePage() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [customerId, setCustomerId] = useState<number|''>('');
  const [quote, setQuote] = useState<QuoteResponse|null>(null);

  useEffect(() => {
    api.get<CustomerResponse[]>('/customers')
       .then(r => setCustomers(r.data));
  }, []);

  const submit = () => {
    api.post<QuoteResponse>('/quotes', { customerId } as CreateQuoteRequest)
       .then(r => setQuote(r.data));
  };

  return (
    <div>
      <select onChange={e => setCustomerId(+e.target.value)}>
        <option value="">Müşteri seç</option>
        {customers.map(c => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.tcNo})
          </option>
        ))}
      </select>
      <button disabled={!customerId} onClick={submit}>
        Teklif Oluştur
      </button>

      {quote && (
        <div>
          <p>RefNo: {quote.refNo}</p>
          <p>Prim: {quote.premiumAmount}</p>
          <p>Risk: {quote.riskScore}</p>
          <p>Durum: {quote.status}</p>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import api from '../api/axios';
import { CustomerResponse } from '../types';  // TS tipleri

export default function CustomersPage() {
  const [data, setData] = useState<CustomerResponse[]>([]);

  useEffect(() => {
    api.get<CustomerResponse[]>('/customers')
      .then(res => setData(res.data));
  }, []);

  return (
    <table>
      <thead>
        <tr><th>ID</th><th>TC No</th><th>İsim</th><th>Doğum</th><th>Telefon</th></tr>
      </thead>
      <tbody>
        {data.map(c =>
          <tr key={c.id}>
            <td>{c.id}</td>
            <td>{c.tcNo}</td>
            <td>{c.name}</td>
            <td>{c.birthDate}</td>
            <td>{c.phone}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

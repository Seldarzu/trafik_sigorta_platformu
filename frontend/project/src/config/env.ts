// src/config/env.ts
/* Vite env'lerini güvenli okuyup tek yerden kullanalım */
const raw = import.meta.env as Record<string, string | undefined>;

const API_BASE_URL = (raw.VITE_API_BASE_URL || '/api').trim();

let DEFAULT_AGENT_ID = (raw.VITE_DEFAULT_AGENT_ID || '').trim();

// Basit UUID kontrolü (36 karakter, tireli)
const uuidLike = /^[0-9a-fA-F-]{36}$/;

if (!uuidLike.test(DEFAULT_AGENT_ID)) {
  // Dev ortamı için güvenli varsayılan. Prod'da .env doldurulmalı.
  DEFAULT_AGENT_ID = '00000000-0000-0000-0000-000000000001';
  if (raw.MODE === 'development') {
    // Bu sadece uyarı; uygulamayı kilitlemiyoruz.
    // KONSOLDA görünecek ki yanlış dosya/konum anlaşılsın.
    // İstersen kaldırabilirsin.
    console.warn(
      '[ENV] VITE_DEFAULT_AGENT_ID bulunamadı ya da geçersiz. ' +
      'Dev için 0000...0001 varsayılanı kullanılıyor. ' +
      'Prod için .env(.local) içinde VITE_DEFAULT_AGENT_ID tanımlayın.'
    );
  }
}

export const ENV = {
  API_BASE_URL,
  DEFAULT_AGENT_ID,
};

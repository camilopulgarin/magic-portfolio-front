// lib/api/config.ts
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(
  /\/$/,
  ''
);
export const CLIENT_API_URL = '/api';

// Öffentliche Zugangsdaten des Supabase-Projekts. Diese Werte dürfen im Browser stehen –
// geschützt werden die Daten über Row Level Security in der Datenbank.
export const SUPABASE_URL = '';
export const SUPABASE_ANON_KEY = '';

/** Öffentlicher VAPID-Schlüssel für Push-Nachrichten (der private liegt nur im Supabase-Vault) */
export const VAPID_PUBLIC_KEY = 'BOrpSPFu-fMldVG9Bw040xQKWeR_MYncn19RFgbdRI54mkrDUG3mIaCnHbwY8JsgZCwPozmsgUOoXxkOHtWGtws';

export const cloudConfigured = () => !!SUPABASE_URL && !!SUPABASE_ANON_KEY;

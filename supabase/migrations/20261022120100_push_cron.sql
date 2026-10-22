-- Zeitplan für den Push-Server: alle 10 Minuten die Edge Function „push-alerts“ aufrufen.
-- Projekt-URL und Cron-Schlüssel liegen im Vault (Namen: orbitus_project_url, orbitus_cron_key).
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'orbitus-push-alerts',
  '*/10 * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'orbitus_project_url') || '/functions/v1/push-alerts',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-key', (select decrypted_secret from vault.decrypted_secrets where name = 'orbitus_cron_key')
    ),
    body := '{"cron": true}'::jsonb,
    timeout_milliseconds := 60000
  );
  $$
);

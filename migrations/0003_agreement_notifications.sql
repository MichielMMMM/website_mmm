ALTER TABLE agreement_acceptances ADD COLUMN notification_status TEXT
  CHECK (notification_status IN ('pending', 'not_configured', 'delivered', 'queued', 'failed'));
ALTER TABLE agreement_acceptances ADD COLUMN notification_updated_at TEXT;

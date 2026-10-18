-- Keep historical account numbers; new registrations leave this column NULL.
CREATE TABLE agreement_acceptances_new (
  id TEXT PRIMARY KEY NOT NULL,
  full_name TEXT NOT NULL CHECK (length(full_name) BETWEEN 2 AND 200),
  mexem_account_number TEXT CHECK (length(mexem_account_number) BETWEEN 3 AND 32),
  strategy TEXT NOT NULL,
  strategy_label TEXT NOT NULL,
  document_name TEXT NOT NULL,
  document_version TEXT NOT NULL,
  document_date TEXT NOT NULL,
  consent_text TEXT NOT NULL,
  accepted INTEGER NOT NULL CHECK (accepted = 1),
  accepted_at TEXT NOT NULL,
  email TEXT,
  positions INTEGER CHECK (positions BETWEEN 1 AND 20),
  indicative_capital INTEGER CHECK (indicative_capital > 0),
  monthly_rate INTEGER CHECK (monthly_rate > 0),
  quarterly_rate INTEGER CHECK (quarterly_rate > 0),
  subscription_consent_text TEXT,
  subscription_accepted INTEGER CHECK (subscription_accepted = 1),
  subscription_version TEXT,
  notification_status TEXT CHECK (notification_status IN ('pending', 'not_configured', 'delivered', 'queued', 'failed')),
  notification_updated_at TEXT,
  initials TEXT,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  phone TEXT,
  postcode TEXT,
  house_number TEXT,
  house_number_addition TEXT,
  street TEXT,
  city TEXT,
  country TEXT,
  notes TEXT,
  confirmation_year INTEGER,
  confirmation_number TEXT
);

INSERT INTO agreement_acceptances_new (
  id, full_name, mexem_account_number, strategy, strategy_label,
  document_name, document_version, document_date, consent_text, accepted, accepted_at,
  email, positions, indicative_capital, monthly_rate, quarterly_rate,
  subscription_consent_text, subscription_accepted, subscription_version,
  notification_status, notification_updated_at, initials, first_name, last_name,
  company_name, phone, postcode, house_number, house_number_addition, street, city,
  country, notes, confirmation_year, confirmation_number
)
SELECT id, full_name, mexem_account_number, strategy, strategy_label,
  document_name, document_version, document_date, consent_text, accepted, accepted_at,
  email, positions, indicative_capital, monthly_rate, quarterly_rate,
  subscription_consent_text, subscription_accepted, subscription_version,
  notification_status, notification_updated_at, initials, first_name, last_name,
  company_name, phone, postcode, house_number, house_number_addition, street, city,
  country, notes, confirmation_year, confirmation_number
FROM agreement_acceptances;

DROP TABLE agreement_acceptances;
ALTER TABLE agreement_acceptances_new RENAME TO agreement_acceptances;

CREATE UNIQUE INDEX agreement_confirmation_number_unique
  ON agreement_acceptances (confirmation_number);

CREATE TRIGGER agreement_assign_confirmation
AFTER INSERT ON agreement_acceptances
WHEN NEW.confirmation_year IS NOT NULL
BEGIN
  INSERT INTO agreement_confirmation_sequences (year, sequence)
    VALUES (NEW.confirmation_year, 1)
    ON CONFLICT (year) DO UPDATE SET sequence = sequence + 1;
  UPDATE agreement_acceptances
    SET confirmation_number = (
      SELECT printf('RUITAB-%d-%03d', year, sequence)
      FROM agreement_confirmation_sequences WHERE year = NEW.confirmation_year
    )
    WHERE id = NEW.id;
END;

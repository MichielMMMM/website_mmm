ALTER TABLE agreement_acceptances ADD COLUMN general_terms_name TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN general_terms_version TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN general_terms_date TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN general_terms_consent_text TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN general_terms_accepted INTEGER CHECK (general_terms_accepted = 1);

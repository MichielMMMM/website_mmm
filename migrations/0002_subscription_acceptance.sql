-- Legacy agreements keep NULL subscription fields: no consent or prices are inferred.
ALTER TABLE agreement_acceptances ADD COLUMN email TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN positions INTEGER CHECK (positions BETWEEN 1 AND 20);
ALTER TABLE agreement_acceptances ADD COLUMN indicative_capital INTEGER CHECK (indicative_capital > 0);
ALTER TABLE agreement_acceptances ADD COLUMN monthly_rate INTEGER CHECK (monthly_rate > 0);
ALTER TABLE agreement_acceptances ADD COLUMN quarterly_rate INTEGER CHECK (quarterly_rate > 0);
ALTER TABLE agreement_acceptances ADD COLUMN subscription_consent_text TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN subscription_accepted INTEGER CHECK (subscription_accepted = 1);
ALTER TABLE agreement_acceptances ADD COLUMN subscription_version TEXT;

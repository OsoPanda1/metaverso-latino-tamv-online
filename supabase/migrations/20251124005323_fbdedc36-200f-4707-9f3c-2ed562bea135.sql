-- ====================================
-- TAMV COMPLETE DATA MODEL
-- ====================================

-- Artists table (extended)
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  bio TEXT,
  portfolio_url TEXT,
  verified BOOLEAN DEFAULT false,
  nft_wallet_address TEXT,
  reputation_score NUMERIC(5,2) DEFAULT 0,
  total_sales NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artworks table (complete)
CREATE TABLE IF NOT EXISTS artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES auth.users(id),
  image_url TEXT,
  thumbnail_url TEXT,
  status VARCHAR(32) DEFAULT 'draft',
  price NUMERIC(12,2),
  currency VARCHAR(8) DEFAULT 'USD',
  nft_token_id TEXT,
  nft_contract_address TEXT,
  blockchain_hash TEXT,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  views_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  sales_count INT DEFAULT 0,
  rarity_score NUMERIC(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artwork versions for traceability
CREATE TABLE IF NOT EXISTS artwork_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  change_type VARCHAR(32),
  changed_by UUID REFERENCES auth.users(id),
  prev_state JSONB,
  new_state JSONB,
  diff JSONB,
  hash VARCHAR(180),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Galleries table
CREATE TABLE IF NOT EXISTS galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  curator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  cover_image_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery artworks junction
CREATE TABLE IF NOT EXISTS gallery_artworks (
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  position INT DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (gallery_id, artwork_id)
);

-- Store products
CREATE TABLE IF NOT EXISTS store_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  price NUMERIC(12,2) NOT NULL,
  dynamic_price NUMERIC(12,2),
  currency VARCHAR(8) DEFAULT 'USD',
  available BOOLEAN DEFAULT true,
  stock_quantity INT DEFAULT 1,
  discount_percentage NUMERIC(5,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions (complete)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES auth.users(id),
  seller_id UUID REFERENCES auth.users(id),
  artwork_id UUID REFERENCES artworks(id),
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(8) DEFAULT 'USD',
  payment_method VARCHAR(50),
  payment_gateway VARCHAR(50),
  stripe_payment_id TEXT,
  crypto_tx_hash TEXT,
  crypto_wallet_from TEXT,
  crypto_wallet_to TEXT,
  status VARCHAR(32) DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFT certificates
CREATE TABLE IF NOT EXISTS nft_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  token_id TEXT NOT NULL,
  contract_address TEXT NOT NULL,
  blockchain VARCHAR(32) DEFAULT 'ethereum',
  mint_tx_hash TEXT,
  owner_wallet TEXT,
  metadata_uri TEXT,
  minted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_transfer_at TIMESTAMP WITH TIME ZONE,
  verified BOOLEAN DEFAULT false
);

-- User recommendations (ML)
CREATE TABLE IF NOT EXISTS user_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  score NUMERIC(5,4),
  reason TEXT,
  algorithm_version VARCHAR(32),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User interactions for ML
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  interaction_type VARCHAR(32),
  duration_seconds INT,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System metrics
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC(12,2),
  metric_type VARCHAR(50),
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fraud detection logs
CREATE TABLE IF NOT EXISTS fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  transaction_id UUID REFERENCES transactions(id),
  alert_type VARCHAR(50),
  severity VARCHAR(20) DEFAULT 'medium',
  anomaly_score NUMERIC(5,4),
  details JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_artworks_artist ON artworks(artist_id);
CREATE INDEX IF NOT EXISTS idx_artworks_owner ON artworks(owner_id);
CREATE INDEX IF NOT EXISTS idx_artworks_status ON artworks(status);
CREATE INDEX IF NOT EXISTS idx_artworks_tags ON artworks USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_nft_certificates_artwork ON nft_certificates(artwork_id);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_user ON user_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_artwork ON user_interactions(artwork_id);

-- Enable RLS
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view public artworks" ON artworks FOR SELECT USING (status = 'published' OR owner_id = auth.uid());
CREATE POLICY "Artists can manage their artworks" ON artworks FOR ALL USING (artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid()));
CREATE POLICY "Users can create artworks" ON artworks FOR INSERT WITH CHECK (artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view public galleries" ON galleries FOR SELECT USING (is_public = true OR curator_id = auth.uid());
CREATE POLICY "Curators manage their galleries" ON galleries FOR ALL USING (curator_id = auth.uid());

CREATE POLICY "Users view their transactions" ON transactions FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());
CREATE POLICY "System creates transactions" ON transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Users view their recommendations" ON user_recommendations FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users create interactions" ON user_interactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users view their interactions" ON user_interactions FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Artists view their profiles" ON artists FOR SELECT USING (true);
CREATE POLICY "Users manage their artist profile" ON artists FOR ALL USING (user_id = auth.uid());

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_artworks_updated_at BEFORE UPDATE ON artworks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_galleries_updated_at BEFORE UPDATE ON galleries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_store_products_updated_at BEFORE UPDATE ON store_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Add missing RLS policies only

-- Policies for artwork_versions
CREATE POLICY "Users can view versions of their artworks" ON artwork_versions 
  FOR SELECT USING (
    artwork_id IN (
      SELECT id FROM artworks WHERE owner_id = auth.uid() 
      OR artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "System creates artwork versions" ON artwork_versions 
  FOR INSERT WITH CHECK (true);

-- Policies for gallery_artworks
CREATE POLICY "Users can view public gallery artworks" ON gallery_artworks 
  FOR SELECT USING (
    gallery_id IN (SELECT id FROM galleries WHERE is_public = true OR curator_id = auth.uid())
  );

CREATE POLICY "Curators manage gallery artworks" ON gallery_artworks 
  FOR ALL USING (
    gallery_id IN (SELECT id FROM galleries WHERE curator_id = auth.uid())
  );

-- Policies for store_products
CREATE POLICY "Anyone can view available products" ON store_products 
  FOR SELECT USING (available = true);

CREATE POLICY "Artists manage their products" ON store_products 
  FOR ALL USING (
    artwork_id IN (
      SELECT id FROM artworks WHERE artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
    )
  );

-- Policies for nft_certificates
CREATE POLICY "Users can view NFT certificates for their artworks" ON nft_certificates 
  FOR SELECT USING (
    artwork_id IN (
      SELECT id FROM artworks WHERE owner_id = auth.uid() 
      OR artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "System creates NFT certificates" ON nft_certificates 
  FOR INSERT WITH CHECK (true);

-- Policies for system_metrics
CREATE POLICY "Admins can view system metrics" ON system_metrics 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "System creates metrics" ON system_metrics 
  FOR INSERT WITH CHECK (true);

-- Policies for fraud_alerts
CREATE POLICY "Admins view fraud alerts" ON fraud_alerts 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "System creates fraud alerts" ON fraud_alerts 
  FOR INSERT WITH CHECK (true);
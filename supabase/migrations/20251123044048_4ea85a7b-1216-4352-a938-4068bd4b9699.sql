-- ============================================================================
-- TAMV COMPLETE ECOSYSTEM - FINAL TABLES & SYSTEMS
-- ============================================================================

-- Virtual Pets System (Mascotas Digitales)
CREATE TABLE IF NOT EXISTS virtual_pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  pet_type TEXT NOT NULL, -- cat, dog, dragon, phoenix, etc.
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  happiness INTEGER DEFAULT 50,
  health INTEGER DEFAULT 100,
  energy INTEGER DEFAULT 100,
  emotional_bond JSONB DEFAULT '{"affection": 0, "trust": 0, "loyalty": 0}'::jsonb,
  appearance JSONB DEFAULT '{}'::jsonb,
  abilities JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_interaction TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Virtual Gifts System (Regalos Virtuales tipo TikTok)
CREATE TABLE IF NOT EXISTS virtual_gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  gift_type TEXT NOT NULL, -- rose, diamond, heart, fire, etc.
  price_credits DECIMAL NOT NULL,
  rarity TEXT DEFAULT 'common', -- common, rare, epic, legendary
  animation_url TEXT,
  icon_url TEXT,
  effects JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_available BOOLEAN DEFAULT true
);

-- Gift Transactions (Registro de envío de regalos)
CREATE TABLE IF NOT EXISTS gift_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  gift_id UUID REFERENCES virtual_gifts(id),
  stream_id UUID REFERENCES live_streams(id),
  post_id UUID REFERENCES posts(id),
  amount INTEGER DEFAULT 1,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Chat Rooms (Salas de chat grupal)
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  room_type TEXT DEFAULT 'public', -- public, private, group
  created_by UUID NOT NULL,
  max_participants INTEGER DEFAULT 100,
  current_participants INTEGER DEFAULT 0,
  is_encrypted BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Chat Messages (Mensajes de chat)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  receiver_id UUID, -- Para mensajes privados
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- text, image, audio, video, gift
  emotional_vector JSONB,
  is_encrypted BOOLEAN DEFAULT true,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- Auction System (Subastas)
CREATE TABLE IF NOT EXISTS auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES digital_assets(id),
  seller_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  starting_price DECIMAL NOT NULL,
  current_price DECIMAL,
  buyout_price DECIMAL,
  highest_bidder_id UUID,
  bid_count INTEGER DEFAULT 0,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, active, ended, cancelled
  winner_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auction Bids (Pujas)
CREATE TABLE IF NOT EXISTS auction_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL,
  bid_amount DECIMAL NOT NULL,
  auto_bid BOOLEAN DEFAULT false,
  max_bid DECIMAL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Isabella AI Sessions (Sesiones extendidas con EOCT™)
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id UUID REFERENCES isabella_sessions(id),
  role TEXT NOT NULL, -- user, assistant, system
  content TEXT NOT NULL,
  emotional_analysis JSONB,
  eoct_filters_applied JSONB,
  quantum_layer INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Admin Permissions
CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  role TEXT DEFAULT 'user', -- user, moderator, admin, superadmin
  permissions JSONB DEFAULT '[]'::jsonb,
  granted_by UUID,
  granted_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- Analytics Dashboard Data
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  metric_type TEXT NOT NULL, -- engagement, earnings, interactions, etc.
  metric_value DECIMAL NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_virtual_pets_user ON virtual_pets(user_id);
CREATE INDEX IF NOT EXISTS idx_virtual_pets_active ON virtual_pets(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_gift_transactions_sender ON gift_transactions(sender_id);
CREATE INDEX IF NOT EXISTS idx_gift_transactions_receiver ON gift_transactions(receiver_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_creator ON chat_rooms(created_by);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_active ON chat_rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_receiver ON chat_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_auctions_seller ON auctions(seller_id);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status, end_time);
CREATE INDEX IF NOT EXISTS idx_auction_bids_auction ON auction_bids(auction_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_user ON ai_chat_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_user ON admin_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user ON user_analytics(user_id, recorded_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE virtual_pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Virtual Pets Policies
CREATE POLICY "Users can manage their pets" ON virtual_pets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view active pets" ON virtual_pets
  FOR SELECT USING (is_active = true);

-- Virtual Gifts Policies
CREATE POLICY "Anyone can view available gifts" ON virtual_gifts
  FOR SELECT USING (is_available = true);

-- Gift Transactions Policies
CREATE POLICY "Users can view gifts they sent or received" ON gift_transactions
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send gifts" ON gift_transactions
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Chat Rooms Policies
CREATE POLICY "Users can view public rooms" ON chat_rooms
  FOR SELECT USING (room_type = 'public' AND is_active = true);

CREATE POLICY "Users can create rooms" ON chat_rooms
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators can manage their rooms" ON chat_rooms
  FOR ALL USING (auth.uid() = created_by);

-- Chat Messages Policies
CREATE POLICY "Users can view messages in their rooms" ON chat_messages
  FOR SELECT USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id OR
    EXISTS (
      SELECT 1 FROM chat_rooms 
      WHERE chat_rooms.id = chat_messages.room_id 
      AND chat_rooms.room_type = 'public'
    )
  );

CREATE POLICY "Users can send messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can delete their messages" ON chat_messages
  FOR DELETE USING (auth.uid() = sender_id);

-- Auctions Policies
CREATE POLICY "Anyone can view active auctions" ON auctions
  FOR SELECT USING (status IN ('pending', 'active'));

CREATE POLICY "Users can create auctions" ON auctions
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can manage their auctions" ON auctions
  FOR ALL USING (auth.uid() = seller_id);

-- Auction Bids Policies
CREATE POLICY "Users can view bids on active auctions" ON auction_bids
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auctions 
      WHERE auctions.id = auction_bids.auction_id 
      AND auctions.status = 'active'
    )
  );

CREATE POLICY "Users can place bids" ON auction_bids
  FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- AI Chat History Policies
CREATE POLICY "Users can manage their chat history" ON ai_chat_history
  FOR ALL USING (auth.uid() = user_id);

-- Admin Permissions Policies
CREATE POLICY "Users can view their own permissions" ON admin_permissions
  FOR SELECT USING (auth.uid() = user_id);

-- User Analytics Policies
CREATE POLICY "Users can view their analytics" ON user_analytics
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE gift_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE auction_bids;
ALTER PUBLICATION supabase_realtime ADD TABLE virtual_pets;
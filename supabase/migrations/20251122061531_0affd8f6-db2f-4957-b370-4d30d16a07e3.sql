-- TAMV Complete Database Schema
-- Comprehensive implementation based on technical documentation

-- ============ CELLS & FORKS SYSTEM ============
CREATE TABLE IF NOT EXISTS public.cells (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cell_type TEXT NOT NULL,
  purpose TEXT,
  emotional_vector JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  guardian_id UUID,
  fork_id UUID,
  properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.forks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sector TEXT NOT NULL, -- Salud, Arte, Educación, Comercio, Memoria
  guardian_symbol TEXT,
  governance_config JSONB DEFAULT '{}'::jsonb,
  panel_4d_config JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============ ISABELLA IA CORE ============
CREATE TABLE IF NOT EXISTS public.isabella_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL, -- text, voice, image, xr, multimodal
  emotional_analysis JSONB,
  context_data JSONB,
  filtered_data JSONB, -- 4-layer quantum filter output
  guardian_validation JSONB,
  eoct_output JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quantum_filters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.isabella_sessions(id) ON DELETE CASCADE,
  layer_number INTEGER NOT NULL, -- 1: Noise, 2: Category, 3: Emotion, 4: Organization
  input_data JSONB NOT NULL,
  output_data JSONB NOT NULL,
  status TEXT NOT NULL, -- approved, rejected, review
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============ DREAMSPACES XR ============
CREATE TABLE IF NOT EXISTS public.dreamspaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  space_type TEXT NOT NULL, -- concert, gallery, educational, commercial, social
  xr_config JSONB DEFAULT '{}'::jsonb,
  emotional_atmosphere JSONB,
  is_public BOOLEAN DEFAULT false,
  max_capacity INTEGER DEFAULT 50,
  scheduled_events JSONB DEFAULT '[]'::jsonb,
  monetization_enabled BOOLEAN DEFAULT false,
  price_credits NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dreamspace_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dreamspace_id UUID NOT NULL REFERENCES public.dreamspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  left_at TIMESTAMP WITH TIME ZONE,
  emotional_state JSONB,
  interactions_count INTEGER DEFAULT 0,
  UNIQUE(dreamspace_id, user_id, joined_at)
);

-- ============ DAO HYBRID SYSTEM ============
CREATE TABLE IF NOT EXISTS public.dao_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  proposal_type TEXT NOT NULL, -- economic, technical, ethical, governance
  impact_score NUMERIC(3,2),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, implemented
  votes_for INTEGER DEFAULT 0,
  votes_against INTEGER DEFAULT 0,
  votes_abstain INTEGER DEFAULT 0,
  guardian_approval BOOLEAN,
  institutional_review JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  voting_deadline TIMESTAMP WITH TIME ZONE,
  implemented_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.dao_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.dao_proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL, -- for, against, abstain
  weight NUMERIC(10,2) DEFAULT 1.0, -- reputation-based weight
  reasoning TEXT,
  emotional_vector JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(proposal_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.reputation_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_score NUMERIC(10,2) DEFAULT 100.0,
  governance_score NUMERIC(10,2) DEFAULT 50.0,
  ethical_score NUMERIC(10,2) DEFAULT 50.0,
  contribution_score NUMERIC(10,2) DEFAULT 0.0,
  history JSONB DEFAULT '[]'::jsonb,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============ TAMV CREDITS & ECONOMIC SYSTEM ============
CREATE TABLE IF NOT EXISTS public.tamv_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  credits_balance NUMERIC(12,2) DEFAULT 0.00,
  total_earned NUMERIC(12,2) DEFAULT 0.00,
  total_spent NUMERIC(12,2) DEFAULT 0.00,
  membership_level TEXT DEFAULT 'free', -- free, premium, vip, elite, celestial
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID NOT NULL REFERENCES public.tamv_wallets(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- purchase, earn, spend, transfer, withdrawal
  amount NUMERIC(12,2) NOT NULL,
  balance_after NUMERIC(12,2) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  related_entity_type TEXT,
  related_entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============ LOTTERY SYSTEM ============
CREATE TABLE IF NOT EXISTS public.lottery_rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  round_number INTEGER NOT NULL UNIQUE,
  total_pot NUMERIC(12,2) DEFAULT 0.00,
  tickets_sold INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- active, drawing, completed
  draw_date TIMESTAMP WITH TIME ZONE NOT NULL,
  winners JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lottery_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  round_id UUID NOT NULL REFERENCES public.lottery_rounds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_number TEXT NOT NULL UNIQUE,
  purchase_price NUMERIC(10,2) NOT NULL,
  is_winner BOOLEAN DEFAULT false,
  prize_amount NUMERIC(12,2),
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============ UNIVERSITY SYSTEM ============
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty_level TEXT, -- beginner, intermediate, advanced
  price_credits NUMERIC(10,2) DEFAULT 0.00,
  duration_hours INTEGER,
  content_modules JSONB DEFAULT '[]'::jsonb,
  certification_enabled BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  enrollment_count INTEGER DEFAULT 0,
  rating_average NUMERIC(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0,
  completed_modules JSONB DEFAULT '[]'::jsonb,
  certification_issued BOOLEAN DEFAULT false,
  certification_id TEXT,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(course_id, user_id)
);

-- ============ SOCIAL HUB ============
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls JSONB DEFAULT '[]'::jsonb,
  post_type TEXT NOT NULL DEFAULT 'text', -- text, image, video, audio, xr
  emotional_vector JSONB,
  visibility TEXT NOT NULL DEFAULT 'public', -- public, friends, private
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  is_monetized BOOLEAN DEFAULT false,
  price_credits NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  emotional_vector JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- ============ LIVE STREAMING ============
CREATE TABLE IF NOT EXISTS public.live_streams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  stream_key TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, live, ended
  viewer_count INTEGER DEFAULT 0,
  max_viewers INTEGER DEFAULT 0,
  monetization_enabled BOOLEAN DEFAULT true,
  gifts_received JSONB DEFAULT '[]'::jsonb,
  total_earnings NUMERIC(12,2) DEFAULT 0.00,
  scheduled_start TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stream_gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stream_id UUID NOT NULL REFERENCES public.live_streams(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gift_type TEXT NOT NULL,
  gift_value_credits NUMERIC(10,2) NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============ MUSIC & AUDIO ============
CREATE TABLE IF NOT EXISTS public.music_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  cover_image_url TEXT,
  duration_seconds INTEGER,
  genre TEXT,
  price_credits NUMERIC(10,2),
  play_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  emotional_classification JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============ BOOKPI PERPETUAL ARCHIVE ============
CREATE TABLE IF NOT EXISTS public.bookpi_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id TEXT NOT NULL UNIQUE,
  source_type TEXT NOT NULL, -- cell, fork, nucleus, user
  source_id UUID,
  event_type TEXT NOT NULL,
  emotional_vector JSONB,
  context_data JSONB NOT NULL,
  guardian_validation BOOLEAN DEFAULT false,
  dilithium_signature TEXT NOT NULL,
  ipfs_hash TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============ PHOENIX PROTOCOL ============
CREATE TABLE IF NOT EXISTS public.phoenix_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL, -- activation, restoration, federation, mutation
  affected_entity_type TEXT NOT NULL,
  affected_entity_id UUID,
  anomaly_detected JSONB,
  restoration_data JSONB,
  guardian_response JSONB,
  status TEXT NOT NULL, -- detected, quarantine, restoring, restored
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- ============ MEMBERSHIP TIERS ============
CREATE TABLE IF NOT EXISTS public.membership_benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level TEXT NOT NULL UNIQUE, -- free, premium, vip, elite, celestial, enterprise, custom, gold, gold_plus
  monthly_price_usd NUMERIC(10,2) NOT NULL,
  commission_rate NUMERIC(5,4) NOT NULL, -- 0.12 to 0.25
  features JSONB NOT NULL,
  limits JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default membership tiers
INSERT INTO public.membership_benefits (level, monthly_price_usd, commission_rate, features, limits) VALUES
('free', 0.00, 0.25, '{"basic_access": true, "max_storage_gb": 5}', '{"max_dreamspaces": 1, "max_courses": 3}'),
('premium', 9.99, 0.20, '{"advanced_features": true, "max_storage_gb": 50}', '{"max_dreamspaces": 5, "max_courses": 20}'),
('vip', 29.99, 0.18, '{"priority_support": true, "max_storage_gb": 200}', '{"max_dreamspaces": 20, "max_courses": 100}'),
('elite', 99.99, 0.15, '{"custom_branding": true, "max_storage_gb": 500}', '{"max_dreamspaces": 100, "max_courses": -1}'),
('celestial', 299.99, 0.12, '{"full_customization": true, "max_storage_gb": -1}', '{"max_dreamspaces": -1, "max_courses": -1}')
ON CONFLICT (level) DO NOTHING;

-- ============ INDEXES FOR PERFORMANCE ============
CREATE INDEX IF NOT EXISTS idx_cells_user_id ON public.cells(user_id);
CREATE INDEX IF NOT EXISTS idx_cells_fork_id ON public.cells(fork_id);
CREATE INDEX IF NOT EXISTS idx_isabella_sessions_user_id ON public.isabella_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_dreamspaces_user_id ON public.dreamspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_dao_proposals_status ON public.dao_proposals(status);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_wallet_id ON public.credit_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_live_streams_status ON public.live_streams(status);
CREATE INDEX IF NOT EXISTS idx_bookpi_entries_source_id ON public.bookpi_entries(source_id);

-- ============ ROW LEVEL SECURITY ============
ALTER TABLE public.cells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isabella_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quantum_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dreamspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dreamspace_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dao_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dao_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reputation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tamv_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lottery_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lottery_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookpi_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phoenix_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_benefits ENABLE ROW LEVEL SECURITY;

-- ============ RLS POLICIES ============
-- Cells
CREATE POLICY "Users can manage their cells" ON public.cells FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view active cells" ON public.cells FOR SELECT USING (is_active = true);

-- Forks
CREATE POLICY "Anyone can view active forks" ON public.forks FOR SELECT USING (is_active = true);

-- Isabella Sessions
CREATE POLICY "Users can manage their sessions" ON public.isabella_sessions FOR ALL USING (auth.uid() = user_id);

-- Quantum Filters
CREATE POLICY "Users can view their filter data" ON public.quantum_filters FOR SELECT 
  USING (EXISTS (SELECT 1 FROM isabella_sessions WHERE isabella_sessions.id = quantum_filters.session_id AND isabella_sessions.user_id = auth.uid()));

-- DreamSpaces
CREATE POLICY "Users can manage their dreamspaces" ON public.dreamspaces FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view public dreamspaces" ON public.dreamspaces FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- DreamSpace Participants
CREATE POLICY "Users can view their participations" ON public.dreamspace_participants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can join dreamspaces" ON public.dreamspace_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

-- DAO
CREATE POLICY "Anyone can view proposals" ON public.dao_proposals FOR SELECT USING (true);
CREATE POLICY "Users can create proposals" ON public.dao_proposals FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view votes" ON public.dao_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote" ON public.dao_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their reputation" ON public.reputation_scores FOR SELECT USING (auth.uid() = user_id);

-- Wallets & Transactions
CREATE POLICY "Users can view their wallet" ON public.tamv_wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their transactions" ON public.credit_transactions FOR SELECT 
  USING (EXISTS (SELECT 1 FROM tamv_wallets WHERE tamv_wallets.id = credit_transactions.wallet_id AND tamv_wallets.user_id = auth.uid()));

-- Lottery
CREATE POLICY "Anyone can view lottery rounds" ON public.lottery_rounds FOR SELECT USING (true);
CREATE POLICY "Users can view their tickets" ON public.lottery_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can buy tickets" ON public.lottery_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Courses
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true OR auth.uid() = instructor_id);
CREATE POLICY "Instructors can manage their courses" ON public.courses FOR ALL USING (auth.uid() = instructor_id);

CREATE POLICY "Users can view their enrollments" ON public.course_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can enroll in courses" ON public.course_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Social
CREATE POLICY "Users can view public posts" ON public.posts FOR SELECT USING (visibility = 'public' OR auth.uid() = user_id);
CREATE POLICY "Users can manage their posts" ON public.posts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view comments on visible posts" ON public.comments FOR SELECT 
  USING (EXISTS (SELECT 1 FROM posts WHERE posts.id = comments.post_id AND (posts.visibility = 'public' OR posts.user_id = auth.uid())));
CREATE POLICY "Users can comment" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can like posts" ON public.post_likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can follow others" ON public.follows FOR ALL USING (auth.uid() = follower_id);

-- Live Streams
CREATE POLICY "Anyone can view live streams" ON public.live_streams FOR SELECT USING (status IN ('live', 'ended'));
CREATE POLICY "Users can manage their streams" ON public.live_streams FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view stream gifts" ON public.stream_gifts FOR SELECT USING (true);
CREATE POLICY "Users can send gifts" ON public.stream_gifts FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Music
CREATE POLICY "Users can view public tracks" ON public.music_tracks FOR SELECT USING (is_public = true OR auth.uid() = artist_id);
CREATE POLICY "Artists can manage their tracks" ON public.music_tracks FOR ALL USING (auth.uid() = artist_id);

-- BookPI
CREATE POLICY "Anyone can view bookpi entries" ON public.bookpi_entries FOR SELECT USING (true);

-- Phoenix
CREATE POLICY "System can manage phoenix events" ON public.phoenix_events FOR ALL USING (true);

-- Membership Benefits
CREATE POLICY "Anyone can view membership tiers" ON public.membership_benefits FOR SELECT USING (true);

-- ============ TRIGGERS ============
CREATE TRIGGER update_cells_updated_at BEFORE UPDATE ON public.cells FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forks_updated_at BEFORE UPDATE ON public.forks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dreamspaces_updated_at BEFORE UPDATE ON public.dreamspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tamv_wallets_updated_at BEFORE UPDATE ON public.tamv_wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============ REALTIME SUBSCRIPTIONS ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_streams;
ALTER PUBLICATION supabase_realtime ADD TABLE public.dao_proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.dreamspace_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.phoenix_events;
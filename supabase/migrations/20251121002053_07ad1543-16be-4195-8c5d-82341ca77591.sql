-- Create entity_relationships table for semantic connections
CREATE TABLE public.entity_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_entity_id UUID NOT NULL REFERENCES public.nexus_entities(id) ON DELETE CASCADE,
  target_entity_id UUID NOT NULL REFERENCES public.nexus_entities(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  strength DECIMAL(3,2) DEFAULT 0.5 CHECK (strength >= 0 AND strength <= 1),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT no_self_reference CHECK (source_entity_id != target_entity_id)
);

-- Create transactional_metadata table for all system events
CREATE TABLE public.transactional_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_id UUID REFERENCES public.nexus_entities(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  state_snapshot JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  hash TEXT,
  parent_transaction_id UUID REFERENCES public.transactional_metadata(id)
);

-- Create digital_inventory table for asset management
CREATE TABLE public.digital_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  asset_id UUID REFERENCES public.digital_assets(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity >= 0),
  acquired_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  is_locked BOOLEAN DEFAULT false,
  UNIQUE(user_id, asset_id)
);

-- Create entity_purposes table for semantic layer
CREATE TABLE public.entity_purposes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID NOT NULL REFERENCES public.nexus_entities(id) ON DELETE CASCADE,
  purpose_type TEXT NOT NULL,
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  context JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_context_memory for Isabella's learning
CREATE TABLE public.ai_context_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  context_key TEXT NOT NULL,
  context_value JSONB NOT NULL,
  relevance_score DECIMAL(3,2) DEFAULT 0.5,
  last_accessed TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, context_key)
);

-- Create marketplace_listings for digital economy
CREATE TABLE public.marketplace_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  asset_id UUID REFERENCES public.digital_assets(id) ON DELETE CASCADE,
  price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
  currency TEXT DEFAULT 'NEXUS_TOKEN',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all new tables
ALTER TABLE public.entity_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactional_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_purposes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_context_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for entity_relationships
CREATE POLICY "Users can view relationships of their entities"
ON public.entity_relationships FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.nexus_entities 
    WHERE id = entity_relationships.source_entity_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create relationships for their entities"
ON public.entity_relationships FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.nexus_entities 
    WHERE id = entity_relationships.source_entity_id 
    AND user_id = auth.uid()
  )
);

-- RLS Policies for transactional_metadata
CREATE POLICY "Users can view their transactions"
ON public.transactional_metadata FOR SELECT
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "System can create transactions"
ON public.transactional_metadata FOR INSERT
WITH CHECK (true);

-- RLS Policies for digital_inventory
CREATE POLICY "Users can view their inventory"
ON public.digital_inventory FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their inventory"
ON public.digital_inventory FOR ALL
USING (user_id = auth.uid());

-- RLS Policies for entity_purposes
CREATE POLICY "Users can view purposes of their entities"
ON public.entity_purposes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.nexus_entities 
    WHERE id = entity_purposes.entity_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage purposes of their entities"
ON public.entity_purposes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.nexus_entities 
    WHERE id = entity_purposes.entity_id 
    AND user_id = auth.uid()
  )
);

-- RLS Policies for ai_context_memory
CREATE POLICY "Users can view their AI context"
ON public.ai_context_memory FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can manage AI context"
ON public.ai_context_memory FOR ALL
USING (user_id = auth.uid());

-- RLS Policies for marketplace_listings
CREATE POLICY "Anyone can view active listings"
ON public.marketplace_listings FOR SELECT
USING (status = 'active' OR seller_id = auth.uid());

CREATE POLICY "Users can create their listings"
ON public.marketplace_listings FOR INSERT
WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Users can update their listings"
ON public.marketplace_listings FOR UPDATE
USING (seller_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_entity_relationships_source ON public.entity_relationships(source_entity_id);
CREATE INDEX idx_entity_relationships_target ON public.entity_relationships(target_entity_id);
CREATE INDEX idx_transactional_metadata_user ON public.transactional_metadata(user_id);
CREATE INDEX idx_transactional_metadata_timestamp ON public.transactional_metadata(timestamp DESC);
CREATE INDEX idx_digital_inventory_user ON public.digital_inventory(user_id);
CREATE INDEX idx_entity_purposes_entity ON public.entity_purposes(entity_id);
CREATE INDEX idx_ai_context_memory_user ON public.ai_context_memory(user_id);
CREATE INDEX idx_marketplace_listings_status ON public.marketplace_listings(status);

-- Trigger for updated_at on entity_relationships
CREATE TRIGGER update_entity_relationships_updated_at
BEFORE UPDATE ON public.entity_relationships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.entity_relationships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactional_metadata;
ALTER PUBLICATION supabase_realtime ADD TABLE public.digital_inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_listings;
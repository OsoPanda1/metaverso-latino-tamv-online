export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      access_logs: {
        Row: {
          created_at: string | null
          event_type: string
          guardian_id: string | null
          id: string
          ip_address: string | null
          location: Json | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          risk_level: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          guardian_id?: string | null
          id?: string
          ip_address?: string | null
          location?: Json | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          risk_level?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          guardian_id?: string | null
          id?: string
          ip_address?: string | null
          location?: Json | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          risk_level?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_logs_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_context_memory: {
        Row: {
          context_key: string
          context_value: Json
          created_at: string
          id: string
          last_accessed: string
          relevance_score: number | null
          user_id: string
        }
        Insert: {
          context_key: string
          context_value: Json
          created_at?: string
          id?: string
          last_accessed?: string
          relevance_score?: number | null
          user_id: string
        }
        Update: {
          context_key?: string
          context_value?: Json
          created_at?: string
          id?: string
          last_accessed?: string
          relevance_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      ai_interactions: {
        Row: {
          created_at: string | null
          id: string
          input_data: Json | null
          interaction_type: string
          model_used: string | null
          output_data: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          input_data?: Json | null
          interaction_type: string
          model_used?: string | null
          output_data?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          input_data?: Json | null
          interaction_type?: string
          model_used?: string | null
          output_data?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bookpi_entries: {
        Row: {
          context_data: Json
          created_at: string | null
          dilithium_signature: string
          emotional_vector: Json | null
          entry_id: string
          event_type: string
          guardian_validation: boolean | null
          id: string
          ipfs_hash: string | null
          source_id: string | null
          source_type: string
          timestamp: string
        }
        Insert: {
          context_data: Json
          created_at?: string | null
          dilithium_signature: string
          emotional_vector?: Json | null
          entry_id: string
          event_type: string
          guardian_validation?: boolean | null
          id?: string
          ipfs_hash?: string | null
          source_id?: string | null
          source_type: string
          timestamp?: string
        }
        Update: {
          context_data?: Json
          created_at?: string | null
          dilithium_signature?: string
          emotional_vector?: Json | null
          entry_id?: string
          event_type?: string
          guardian_validation?: boolean | null
          id?: string
          ipfs_hash?: string | null
          source_id?: string | null
          source_type?: string
          timestamp?: string
        }
        Relationships: []
      }
      cells: {
        Row: {
          cell_type: string
          created_at: string | null
          emotional_vector: Json | null
          fork_id: string | null
          guardian_id: string | null
          id: string
          is_active: boolean | null
          name: string
          properties: Json | null
          purpose: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cell_type: string
          created_at?: string | null
          emotional_vector?: Json | null
          fork_id?: string | null
          guardian_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          properties?: Json | null
          purpose?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cell_type?: string
          created_at?: string | null
          emotional_vector?: Json | null
          fork_id?: string | null
          guardian_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          properties?: Json | null
          purpose?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          emotional_vector: Json | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          emotional_vector?: Json | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          emotional_vector?: Json | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          certification_id: string | null
          certification_issued: boolean | null
          completed_at: string | null
          completed_modules: Json | null
          course_id: string
          enrolled_at: string | null
          id: string
          progress_percentage: number | null
          user_id: string
        }
        Insert: {
          certification_id?: string | null
          certification_issued?: boolean | null
          completed_at?: string | null
          completed_modules?: Json | null
          course_id: string
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          user_id: string
        }
        Update: {
          certification_id?: string | null
          certification_issued?: boolean | null
          completed_at?: string | null
          completed_modules?: Json | null
          course_id?: string
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          certification_enabled: boolean | null
          content_modules: Json | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration_hours: number | null
          enrollment_count: number | null
          id: string
          instructor_id: string
          is_published: boolean | null
          price_credits: number | null
          rating_average: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          certification_enabled?: boolean | null
          content_modules?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          enrollment_count?: number | null
          id?: string
          instructor_id: string
          is_published?: boolean | null
          price_credits?: number | null
          rating_average?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          certification_enabled?: boolean | null
          content_modules?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          enrollment_count?: number | null
          id?: string
          instructor_id?: string
          is_published?: boolean | null
          price_credits?: number | null
          rating_average?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          related_entity_id: string | null
          related_entity_type: string | null
          transaction_type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          transaction_type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          transaction_type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "tamv_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      dao_proposals: {
        Row: {
          created_at: string | null
          description: string
          guardian_approval: boolean | null
          id: string
          impact_score: number | null
          implemented_at: string | null
          institutional_review: Json | null
          proposal_type: string
          status: string
          title: string
          user_id: string
          votes_abstain: number | null
          votes_against: number | null
          votes_for: number | null
          voting_deadline: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          guardian_approval?: boolean | null
          id?: string
          impact_score?: number | null
          implemented_at?: string | null
          institutional_review?: Json | null
          proposal_type: string
          status?: string
          title: string
          user_id: string
          votes_abstain?: number | null
          votes_against?: number | null
          votes_for?: number | null
          voting_deadline?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          guardian_approval?: boolean | null
          id?: string
          impact_score?: number | null
          implemented_at?: string | null
          institutional_review?: Json | null
          proposal_type?: string
          status?: string
          title?: string
          user_id?: string
          votes_abstain?: number | null
          votes_against?: number | null
          votes_for?: number | null
          voting_deadline?: string | null
        }
        Relationships: []
      }
      dao_votes: {
        Row: {
          created_at: string | null
          emotional_vector: Json | null
          id: string
          proposal_id: string
          reasoning: string | null
          user_id: string
          vote_type: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          emotional_vector?: Json | null
          id?: string
          proposal_id: string
          reasoning?: string | null
          user_id: string
          vote_type: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          emotional_vector?: Json | null
          id?: string
          proposal_id?: string
          reasoning?: string | null
          user_id?: string
          vote_type?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dao_votes_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "dao_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      data_permissions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          granted_at: string | null
          granted_to: string
          granted_to_type: string
          id: string
          metadata: Json | null
          permission_level: string
          resource_id: string | null
          resource_type: string
          revoked: boolean | null
          revoked_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          granted_at?: string | null
          granted_to: string
          granted_to_type: string
          id?: string
          metadata?: Json | null
          permission_level?: string
          resource_id?: string | null
          resource_type: string
          revoked?: boolean | null
          revoked_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          granted_at?: string | null
          granted_to?: string
          granted_to_type?: string
          id?: string
          metadata?: Json | null
          permission_level?: string
          resource_id?: string | null
          resource_type?: string
          revoked?: boolean | null
          revoked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      digital_assets: {
        Row: {
          asset_type: string
          created_at: string | null
          file_url: string | null
          id: string
          is_public: boolean | null
          metadata: Json | null
          name: string
          user_id: string
        }
        Insert: {
          asset_type: string
          created_at?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          name: string
          user_id: string
        }
        Update: {
          asset_type?: string
          created_at?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      digital_credentials: {
        Row: {
          avatar_url: string | null
          birthdate: string | null
          created_at: string | null
          credential_type: string
          did: string
          email: string | null
          expires_at: string | null
          guardian_signature: string | null
          id: string
          issued_at: string
          metadata: Json | null
          name: string
          revocable: boolean | null
          shared_with: Json | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          birthdate?: string | null
          created_at?: string | null
          credential_type: string
          did: string
          email?: string | null
          expires_at?: string | null
          guardian_signature?: string | null
          id?: string
          issued_at?: string
          metadata?: Json | null
          name: string
          revocable?: boolean | null
          shared_with?: Json | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          birthdate?: string | null
          created_at?: string | null
          credential_type?: string
          did?: string
          email?: string | null
          expires_at?: string | null
          guardian_signature?: string | null
          id?: string
          issued_at?: string
          metadata?: Json | null
          name?: string
          revocable?: boolean | null
          shared_with?: Json | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      digital_inventory: {
        Row: {
          acquired_at: string
          asset_id: string | null
          id: string
          is_locked: boolean | null
          metadata: Json | null
          quantity: number | null
          user_id: string
        }
        Insert: {
          acquired_at?: string
          asset_id?: string | null
          id?: string
          is_locked?: boolean | null
          metadata?: Json | null
          quantity?: number | null
          user_id: string
        }
        Update: {
          acquired_at?: string
          asset_id?: string | null
          id?: string
          is_locked?: boolean | null
          metadata?: Json | null
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "digital_inventory_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "digital_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      dreamspace_participants: {
        Row: {
          dreamspace_id: string
          emotional_state: Json | null
          id: string
          interactions_count: number | null
          joined_at: string | null
          left_at: string | null
          user_id: string
        }
        Insert: {
          dreamspace_id: string
          emotional_state?: Json | null
          id?: string
          interactions_count?: number | null
          joined_at?: string | null
          left_at?: string | null
          user_id: string
        }
        Update: {
          dreamspace_id?: string
          emotional_state?: Json | null
          id?: string
          interactions_count?: number | null
          joined_at?: string | null
          left_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dreamspace_participants_dreamspace_id_fkey"
            columns: ["dreamspace_id"]
            isOneToOne: false
            referencedRelation: "dreamspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      dreamspaces: {
        Row: {
          created_at: string | null
          description: string | null
          emotional_atmosphere: Json | null
          id: string
          is_public: boolean | null
          max_capacity: number | null
          monetization_enabled: boolean | null
          name: string
          price_credits: number | null
          scheduled_events: Json | null
          space_type: string
          updated_at: string | null
          user_id: string
          xr_config: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          emotional_atmosphere?: Json | null
          id?: string
          is_public?: boolean | null
          max_capacity?: number | null
          monetization_enabled?: boolean | null
          name: string
          price_credits?: number | null
          scheduled_events?: Json | null
          space_type: string
          updated_at?: string | null
          user_id: string
          xr_config?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          emotional_atmosphere?: Json | null
          id?: string
          is_public?: boolean | null
          max_capacity?: number | null
          monetization_enabled?: boolean | null
          name?: string
          price_credits?: number | null
          scheduled_events?: Json | null
          space_type?: string
          updated_at?: string | null
          user_id?: string
          xr_config?: Json | null
        }
        Relationships: []
      }
      emotional_diary: {
        Row: {
          audio_url: string | null
          content: string | null
          created_at: string | null
          emotions: Json | null
          entry_type: string
          id: string
          is_private: boolean | null
          sentiment: string | null
          sentiment_score: number | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
          voice_analysis: Json | null
        }
        Insert: {
          audio_url?: string | null
          content?: string | null
          created_at?: string | null
          emotions?: Json | null
          entry_type?: string
          id?: string
          is_private?: boolean | null
          sentiment?: string | null
          sentiment_score?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
          voice_analysis?: Json | null
        }
        Update: {
          audio_url?: string | null
          content?: string | null
          created_at?: string | null
          emotions?: Json | null
          entry_type?: string
          id?: string
          is_private?: boolean | null
          sentiment?: string | null
          sentiment_score?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
          voice_analysis?: Json | null
        }
        Relationships: []
      }
      entity_purposes: {
        Row: {
          context: Json | null
          created_at: string
          entity_id: string
          id: string
          is_active: boolean | null
          priority: number | null
          purpose_type: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          entity_id: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          purpose_type: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          entity_id?: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          purpose_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_purposes_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "nexus_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_relationships: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          relationship_type: string
          source_entity_id: string
          strength: number | null
          target_entity_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          relationship_type: string
          source_entity_id: string
          strength?: number | null
          target_entity_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          relationship_type?: string
          source_entity_id?: string
          strength?: number | null
          target_entity_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_relationships_source_entity_id_fkey"
            columns: ["source_entity_id"]
            isOneToOne: false
            referencedRelation: "nexus_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_relationships_target_entity_id_fkey"
            columns: ["target_entity_id"]
            isOneToOne: false
            referencedRelation: "nexus_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      forks: {
        Row: {
          created_at: string | null
          governance_config: Json | null
          guardian_symbol: string | null
          id: string
          is_active: boolean | null
          name: string
          panel_4d_config: Json | null
          sector: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          governance_config?: Json | null
          guardian_symbol?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          panel_4d_config?: Json | null
          sector: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          governance_config?: Json | null
          guardian_symbol?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          panel_4d_config?: Json | null
          sector?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      guardian_alerts: {
        Row: {
          action_taken: string | null
          alert_type: string
          created_at: string | null
          description: string | null
          guardian_id: string
          id: string
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          severity: string
          title: string
          user_id: string
        }
        Insert: {
          action_taken?: string | null
          alert_type: string
          created_at?: string | null
          description?: string | null
          guardian_id: string
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
          title: string
          user_id: string
        }
        Update: {
          action_taken?: string | null
          alert_type?: string
          created_at?: string | null
          description?: string | null
          guardian_id?: string
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardian_alerts_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
        ]
      }
      guardians: {
        Row: {
          alerts_enabled: boolean | null
          config: Json | null
          created_at: string | null
          guardian_type: string
          id: string
          name: string
          status: string
          strict_mode: boolean | null
          trust_score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alerts_enabled?: boolean | null
          config?: Json | null
          created_at?: string | null
          guardian_type?: string
          id?: string
          name: string
          status?: string
          strict_mode?: boolean | null
          trust_score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alerts_enabled?: boolean | null
          config?: Json | null
          created_at?: string | null
          guardian_type?: string
          id?: string
          name?: string
          status?: string
          strict_mode?: boolean | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      isabella_sessions: {
        Row: {
          context_data: Json | null
          created_at: string | null
          emotional_analysis: Json | null
          eoct_output: Json | null
          filtered_data: Json | null
          guardian_validation: Json | null
          id: string
          session_type: string
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          created_at?: string | null
          emotional_analysis?: Json | null
          eoct_output?: Json | null
          filtered_data?: Json | null
          guardian_validation?: Json | null
          id?: string
          session_type: string
          user_id: string
        }
        Update: {
          context_data?: Json | null
          created_at?: string | null
          emotional_analysis?: Json | null
          eoct_output?: Json | null
          filtered_data?: Json | null
          guardian_validation?: Json | null
          id?: string
          session_type?: string
          user_id?: string
        }
        Relationships: []
      }
      live_streams: {
        Row: {
          created_at: string | null
          description: string | null
          ended_at: string | null
          gifts_received: Json | null
          id: string
          max_viewers: number | null
          monetization_enabled: boolean | null
          scheduled_start: string | null
          started_at: string | null
          status: string
          stream_key: string | null
          title: string
          total_earnings: number | null
          user_id: string
          viewer_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          gifts_received?: Json | null
          id?: string
          max_viewers?: number | null
          monetization_enabled?: boolean | null
          scheduled_start?: string | null
          started_at?: string | null
          status?: string
          stream_key?: string | null
          title: string
          total_earnings?: number | null
          user_id: string
          viewer_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          gifts_received?: Json | null
          id?: string
          max_viewers?: number | null
          monetization_enabled?: boolean | null
          scheduled_start?: string | null
          started_at?: string | null
          status?: string
          stream_key?: string | null
          title?: string
          total_earnings?: number | null
          user_id?: string
          viewer_count?: number | null
        }
        Relationships: []
      }
      lottery_rounds: {
        Row: {
          created_at: string | null
          draw_date: string
          id: string
          round_number: number
          status: string
          tickets_sold: number | null
          total_pot: number | null
          winners: Json | null
        }
        Insert: {
          created_at?: string | null
          draw_date: string
          id?: string
          round_number: number
          status?: string
          tickets_sold?: number | null
          total_pot?: number | null
          winners?: Json | null
        }
        Update: {
          created_at?: string | null
          draw_date?: string
          id?: string
          round_number?: number
          status?: string
          tickets_sold?: number | null
          total_pot?: number | null
          winners?: Json | null
        }
        Relationships: []
      }
      lottery_tickets: {
        Row: {
          id: string
          is_winner: boolean | null
          prize_amount: number | null
          purchase_price: number
          purchased_at: string | null
          round_id: string
          ticket_number: string
          user_id: string
        }
        Insert: {
          id?: string
          is_winner?: boolean | null
          prize_amount?: number | null
          purchase_price: number
          purchased_at?: string | null
          round_id: string
          ticket_number: string
          user_id: string
        }
        Update: {
          id?: string
          is_winner?: boolean | null
          prize_amount?: number | null
          purchase_price?: number
          purchased_at?: string | null
          round_id?: string
          ticket_number?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lottery_tickets_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "lottery_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listings: {
        Row: {
          asset_id: string | null
          created_at: string
          currency: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          price: number
          seller_id: string
          status: string | null
        }
        Insert: {
          asset_id?: string | null
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          price: number
          seller_id: string
          status?: string | null
        }
        Update: {
          asset_id?: string | null
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          price?: number
          seller_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "digital_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_benefits: {
        Row: {
          commission_rate: number
          created_at: string | null
          features: Json
          id: string
          level: string
          limits: Json
          monthly_price_usd: number
        }
        Insert: {
          commission_rate: number
          created_at?: string | null
          features: Json
          id?: string
          level: string
          limits: Json
          monthly_price_usd: number
        }
        Update: {
          commission_rate?: number
          created_at?: string | null
          features?: Json
          id?: string
          level?: string
          limits?: Json
          monthly_price_usd?: number
        }
        Relationships: []
      }
      music_tracks: {
        Row: {
          artist_id: string
          audio_url: string
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          download_count: number | null
          duration_seconds: number | null
          emotional_classification: Json | null
          genre: string | null
          id: string
          is_public: boolean | null
          play_count: number | null
          price_credits: number | null
          title: string
        }
        Insert: {
          artist_id: string
          audio_url: string
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          duration_seconds?: number | null
          emotional_classification?: Json | null
          genre?: string | null
          id?: string
          is_public?: boolean | null
          play_count?: number | null
          price_credits?: number | null
          title: string
        }
        Update: {
          artist_id?: string
          audio_url?: string
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          duration_seconds?: number | null
          emotional_classification?: Json | null
          genre?: string | null
          id?: string
          is_public?: boolean | null
          play_count?: number | null
          price_credits?: number | null
          title?: string
        }
        Relationships: []
      }
      nexus_entities: {
        Row: {
          created_at: string | null
          description: string | null
          entity_type: string
          id: string
          is_active: boolean | null
          name: string
          properties: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          entity_type: string
          id?: string
          is_active?: boolean | null
          name: string
          properties?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          entity_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          properties?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      phoenix_events: {
        Row: {
          affected_entity_id: string | null
          affected_entity_type: string
          anomaly_detected: Json | null
          created_at: string | null
          event_type: string
          guardian_response: Json | null
          id: string
          resolved_at: string | null
          restoration_data: Json | null
          status: string
        }
        Insert: {
          affected_entity_id?: string | null
          affected_entity_type: string
          anomaly_detected?: Json | null
          created_at?: string | null
          event_type: string
          guardian_response?: Json | null
          id?: string
          resolved_at?: string | null
          restoration_data?: Json | null
          status: string
        }
        Update: {
          affected_entity_id?: string | null
          affected_entity_type?: string
          anomaly_detected?: Json | null
          created_at?: string | null
          event_type?: string
          guardian_response?: Json | null
          id?: string
          resolved_at?: string | null
          restoration_data?: Json | null
          status?: string
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string | null
          emotional_vector: Json | null
          id: string
          is_monetized: boolean | null
          likes_count: number | null
          media_urls: Json | null
          post_type: string
          price_credits: number | null
          shares_count: number | null
          user_id: string
          visibility: string
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string | null
          emotional_vector?: Json | null
          id?: string
          is_monetized?: boolean | null
          likes_count?: number | null
          media_urls?: Json | null
          post_type?: string
          price_credits?: number | null
          shares_count?: number | null
          user_id: string
          visibility?: string
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string | null
          emotional_vector?: Json | null
          id?: string
          is_monetized?: boolean | null
          likes_count?: number | null
          media_urls?: Json | null
          post_type?: string
          price_credits?: number | null
          shares_count?: number | null
          user_id?: string
          visibility?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      quantum_filters: {
        Row: {
          created_at: string | null
          id: string
          input_data: Json
          layer_number: number
          output_data: Json
          processing_time_ms: number | null
          session_id: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          input_data: Json
          layer_number: number
          output_data: Json
          processing_time_ms?: number | null
          session_id?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          id?: string
          input_data?: Json
          layer_number?: number
          output_data?: Json
          processing_time_ms?: number | null
          session_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "quantum_filters_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "isabella_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      reputation_scores: {
        Row: {
          contribution_score: number | null
          ethical_score: number | null
          governance_score: number | null
          history: Json | null
          id: string
          last_updated: string | null
          total_score: number | null
          user_id: string
        }
        Insert: {
          contribution_score?: number | null
          ethical_score?: number | null
          governance_score?: number | null
          history?: Json | null
          id?: string
          last_updated?: string | null
          total_score?: number | null
          user_id: string
        }
        Update: {
          contribution_score?: number | null
          ethical_score?: number | null
          governance_score?: number | null
          history?: Json | null
          id?: string
          last_updated?: string | null
          total_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      stream_gifts: {
        Row: {
          created_at: string | null
          gift_type: string
          gift_value_credits: number
          id: string
          message: string | null
          sender_id: string
          stream_id: string
        }
        Insert: {
          created_at?: string | null
          gift_type: string
          gift_value_credits: number
          id?: string
          message?: string | null
          sender_id: string
          stream_id: string
        }
        Update: {
          created_at?: string | null
          gift_type?: string
          gift_value_credits?: number
          id?: string
          message?: string | null
          sender_id?: string
          stream_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stream_gifts_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "live_streams"
            referencedColumns: ["id"]
          },
        ]
      }
      tamv_wallets: {
        Row: {
          created_at: string | null
          credits_balance: number | null
          id: string
          membership_level: string | null
          total_earned: number | null
          total_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credits_balance?: number | null
          id?: string
          membership_level?: string | null
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credits_balance?: number | null
          id?: string
          membership_level?: string | null
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactional_metadata: {
        Row: {
          entity_id: string | null
          hash: string | null
          id: string
          parent_transaction_id: string | null
          payload: Json
          state_snapshot: Json | null
          timestamp: string
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          entity_id?: string | null
          hash?: string | null
          id?: string
          parent_transaction_id?: string | null
          payload?: Json
          state_snapshot?: Json | null
          timestamp?: string
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          entity_id?: string | null
          hash?: string | null
          id?: string
          parent_transaction_id?: string | null
          payload?: Json
          state_snapshot?: Json | null
          timestamp?: string
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactional_metadata_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "nexus_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactional_metadata_parent_transaction_id_fkey"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactional_metadata"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

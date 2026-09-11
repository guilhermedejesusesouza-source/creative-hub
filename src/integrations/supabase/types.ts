export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      activities: {
        Row: {
          action: string;
          actor: string | null;
          created_at: string;
          description: string | null;
          entity_id: string | null;
          entity_type: string | null;
          id: string;
          workspace_id: string;
        };
        Insert: {
          action: string;
          actor?: string | null;
          created_at?: string;
          description?: string | null;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          workspace_id: string;
        };
        Update: {
          action?: string;
          actor?: string | null;
          created_at?: string;
          description?: string | null;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activities_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      angles: {
        Row: {
          category: string;
          created_at: string;
          description: string | null;
          examples: string | null;
          id: string;
          is_demo: boolean;
          is_favorite: boolean;
          name: string;
          tags: string[] | null;
          updated_at: string;
          when_to_use: string | null;
          workspace_id: string;
        };
        Insert: {
          category?: string;
          created_at?: string;
          description?: string | null;
          examples?: string | null;
          id?: string;
          is_demo?: boolean;
          is_favorite?: boolean;
          name: string;
          tags?: string[] | null;
          updated_at?: string;
          when_to_use?: string | null;
          workspace_id: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string | null;
          examples?: string | null;
          id?: string;
          is_demo?: boolean;
          is_favorite?: boolean;
          name?: string;
          tags?: string[] | null;
          updated_at?: string;
          when_to_use?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "angles_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      approvals: {
        Row: {
          comment: string | null;
          created_at: string;
          creative_id: string;
          id: string;
          reviewer: string | null;
          status: string;
          updated_at: string;
          version_id: string | null;
          workspace_id: string;
        };
        Insert: {
          comment?: string | null;
          created_at?: string;
          creative_id: string;
          id?: string;
          reviewer?: string | null;
          status?: string;
          updated_at?: string;
          version_id?: string | null;
          workspace_id: string;
        };
        Update: {
          comment?: string | null;
          created_at?: string;
          creative_id?: string;
          id?: string;
          reviewer?: string | null;
          status?: string;
          updated_at?: string;
          version_id?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "approvals_creative_id_fkey";
            columns: ["creative_id"];
            isOneToOne: false;
            referencedRelation: "creatives";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "approvals_version_id_fkey";
            columns: ["version_id"];
            isOneToOne: false;
            referencedRelation: "creative_versions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "approvals_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      assets: {
        Row: {
          client_id: string | null;
          created_at: string;
          creative_id: string | null;
          format: string | null;
          height: number | null;
          id: string;
          is_demo: boolean;
          name: string;
          project_id: string | null;
          tags: string[] | null;
          type: string | null;
          updated_at: string;
          url: string | null;
          version: number;
          width: number | null;
          workspace_id: string;
        };
        Insert: {
          client_id?: string | null;
          created_at?: string;
          creative_id?: string | null;
          format?: string | null;
          height?: number | null;
          id?: string;
          is_demo?: boolean;
          name: string;
          project_id?: string | null;
          tags?: string[] | null;
          type?: string | null;
          updated_at?: string;
          url?: string | null;
          version?: number;
          width?: number | null;
          workspace_id: string;
        };
        Update: {
          client_id?: string | null;
          created_at?: string;
          creative_id?: string | null;
          format?: string | null;
          height?: number | null;
          id?: string;
          is_demo?: boolean;
          name?: string;
          project_id?: string | null;
          tags?: string[] | null;
          type?: string | null;
          updated_at?: string;
          url?: string | null;
          version?: number;
          width?: number | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assets_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assets_creative_id_fkey";
            columns: ["creative_id"];
            isOneToOne: false;
            referencedRelation: "creatives";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assets_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assets_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      briefs: {
        Row: {
          awareness: string | null;
          client_id: string | null;
          created_at: string;
          data: Json;
          funnel: string | null;
          id: string;
          is_demo: boolean;
          project_id: string | null;
          status: string;
          title: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          awareness?: string | null;
          client_id?: string | null;
          created_at?: string;
          data?: Json;
          funnel?: string | null;
          id?: string;
          is_demo?: boolean;
          project_id?: string | null;
          status?: string;
          title: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          awareness?: string | null;
          client_id?: string | null;
          created_at?: string;
          data?: Json;
          funnel?: string | null;
          id?: string;
          is_demo?: boolean;
          project_id?: string | null;
          status?: string;
          title?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "briefs_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "briefs_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "briefs_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      campaigns: {
        Row: {
          budget: number | null;
          client_id: string | null;
          created_at: string;
          external_id: string | null;
          id: string;
          is_demo: boolean;
          name: string;
          objective: string | null;
          platform: string | null;
          project_id: string | null;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          budget?: number | null;
          client_id?: string | null;
          created_at?: string;
          external_id?: string | null;
          id?: string;
          is_demo?: boolean;
          name: string;
          objective?: string | null;
          platform?: string | null;
          project_id?: string | null;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          budget?: number | null;
          client_id?: string | null;
          created_at?: string;
          external_id?: string | null;
          id?: string;
          is_demo?: boolean;
          name?: string;
          objective?: string | null;
          platform?: string | null;
          project_id?: string | null;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaigns_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "campaigns_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "campaigns_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      client_notes: {
        Row: {
          author: string | null;
          body: string | null;
          category: string;
          client_id: string | null;
          created_at: string;
          id: string;
          is_pinned: boolean;
          lead_id: string | null;
          priority: string;
          tags: string[] | null;
          title: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          author?: string | null;
          body?: string | null;
          category?: string;
          client_id?: string | null;
          created_at?: string;
          id?: string;
          is_pinned?: boolean;
          lead_id?: string | null;
          priority?: string;
          tags?: string[] | null;
          title: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          author?: string | null;
          body?: string | null;
          category?: string;
          client_id?: string | null;
          created_at?: string;
          id?: string;
          is_pinned?: boolean;
          lead_id?: string | null;
          priority?: string;
          tags?: string[] | null;
          title?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "client_notes_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "client_notes_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "client_notes_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      clients: {
        Row: {
          account_manager: string | null;
          brand_colors: string[] | null;
          brand_fonts: string | null;
          brand_notes: string | null;
          city: string | null;
          close_date: string | null;
          cnpj: string | null;
          company: string | null;
          contact_email: string | null;
          contact_name: string | null;
          contact_phone: string | null;
          contract_value: number | null;
          created_at: string;
          due_day: number | null;
          entry_date: string | null;
          financial_status: string | null;
          health: string;
          health_notes: string | null;
          id: string;
          instagram: string | null;
          is_demo: boolean;
          lead_id: string | null;
          logo_url: string | null;
          monthly_value: number | null;
          name: string;
          notes: string | null;
          plan: string | null;
          priority: string;
          sales_owner: string | null;
          segment: string | null;
          service: string | null;
          source: string | null;
          state: string | null;
          status: string;
          tags: string[] | null;
          trade_name: string | null;
          updated_at: string;
          website: string | null;
          whatsapp: string | null;
          workspace_id: string;
        };
        Insert: {
          account_manager?: string | null;
          brand_colors?: string[] | null;
          brand_fonts?: string | null;
          brand_notes?: string | null;
          city?: string | null;
          close_date?: string | null;
          cnpj?: string | null;
          company?: string | null;
          contact_email?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          contract_value?: number | null;
          created_at?: string;
          due_day?: number | null;
          entry_date?: string | null;
          financial_status?: string | null;
          health?: string;
          health_notes?: string | null;
          id?: string;
          instagram?: string | null;
          is_demo?: boolean;
          lead_id?: string | null;
          logo_url?: string | null;
          monthly_value?: number | null;
          name: string;
          notes?: string | null;
          plan?: string | null;
          priority?: string;
          sales_owner?: string | null;
          segment?: string | null;
          service?: string | null;
          source?: string | null;
          state?: string | null;
          status?: string;
          tags?: string[] | null;
          trade_name?: string | null;
          updated_at?: string;
          website?: string | null;
          whatsapp?: string | null;
          workspace_id: string;
        };
        Update: {
          account_manager?: string | null;
          brand_colors?: string[] | null;
          brand_fonts?: string | null;
          brand_notes?: string | null;
          city?: string | null;
          close_date?: string | null;
          cnpj?: string | null;
          company?: string | null;
          contact_email?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          contract_value?: number | null;
          created_at?: string;
          due_day?: number | null;
          entry_date?: string | null;
          financial_status?: string | null;
          health?: string;
          health_notes?: string | null;
          id?: string;
          instagram?: string | null;
          is_demo?: boolean;
          lead_id?: string | null;
          logo_url?: string | null;
          monthly_value?: number | null;
          name?: string;
          notes?: string | null;
          plan?: string | null;
          priority?: string;
          sales_owner?: string | null;
          segment?: string | null;
          service?: string | null;
          source?: string | null;
          state?: string | null;
          status?: string;
          tags?: string[] | null;
          trade_name?: string | null;
          updated_at?: string;
          website?: string | null;
          whatsapp?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clients_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "clients_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      comments: {
        Row: {
          author: string | null;
          body: string;
          created_at: string;
          entity_id: string;
          entity_type: string;
          id: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          author?: string | null;
          body: string;
          created_at?: string;
          entity_id: string;
          entity_type: string;
          id?: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          author?: string | null;
          body?: string;
          created_at?: string;
          entity_id?: string;
          entity_type?: string;
          id?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      copy_items: {
        Row: {
          awareness: string | null;
          client_id: string | null;
          created_at: string;
          cta: string | null;
          format: string | null;
          funnel: string | null;
          headline: string | null;
          id: string;
          is_demo: boolean;
          is_favorite: boolean;
          primary_text: string | null;
          project_id: string | null;
          tags: string[] | null;
          title: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          awareness?: string | null;
          client_id?: string | null;
          created_at?: string;
          cta?: string | null;
          format?: string | null;
          funnel?: string | null;
          headline?: string | null;
          id?: string;
          is_demo?: boolean;
          is_favorite?: boolean;
          primary_text?: string | null;
          project_id?: string | null;
          tags?: string[] | null;
          title: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          awareness?: string | null;
          client_id?: string | null;
          created_at?: string;
          cta?: string | null;
          format?: string | null;
          funnel?: string | null;
          headline?: string | null;
          id?: string;
          is_demo?: boolean;
          is_favorite?: boolean;
          primary_text?: string | null;
          project_id?: string | null;
          tags?: string[] | null;
          title?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "copy_items_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "copy_items_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "copy_items_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      creative_concepts: {
        Row: {
          big_idea: string | null;
          created_at: string;
          creative_id: string;
          cta: string | null;
          id: string;
          main_message: string | null;
          mechanism: string | null;
          problem: string | null;
          proof: string | null;
          rationale: string | null;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          big_idea?: string | null;
          created_at?: string;
          creative_id: string;
          cta?: string | null;
          id?: string;
          main_message?: string | null;
          mechanism?: string | null;
          problem?: string | null;
          proof?: string | null;
          rationale?: string | null;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          big_idea?: string | null;
          created_at?: string;
          creative_id?: string;
          cta?: string | null;
          id?: string;
          main_message?: string | null;
          mechanism?: string | null;
          problem?: string | null;
          proof?: string | null;
          rationale?: string | null;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "creative_concepts_creative_id_fkey";
            columns: ["creative_id"];
            isOneToOne: false;
            referencedRelation: "creatives";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "creative_concepts_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      creative_directions: {
        Row: {
          characters: string | null;
          colors: string | null;
          composition: string | null;
          created_at: string;
          creative_id: string;
          elements: string | null;
          format: string | null;
          hierarchy: string | null;
          id: string;
          motion: string | null;
          production_notes: string | null;
          refs: string | null;
          scenario: string | null;
          style: string | null;
          typography: string | null;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          characters?: string | null;
          colors?: string | null;
          composition?: string | null;
          created_at?: string;
          creative_id: string;
          elements?: string | null;
          format?: string | null;
          hierarchy?: string | null;
          id?: string;
          motion?: string | null;
          production_notes?: string | null;
          refs?: string | null;
          scenario?: string | null;
          style?: string | null;
          typography?: string | null;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          characters?: string | null;
          colors?: string | null;
          composition?: string | null;
          created_at?: string;
          creative_id?: string;
          elements?: string | null;
          format?: string | null;
          hierarchy?: string | null;
          id?: string;
          motion?: string | null;
          production_notes?: string | null;
          refs?: string | null;
          scenario?: string | null;
          style?: string | null;
          typography?: string | null;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "creative_directions_creative_id_fkey";
            columns: ["creative_id"];
            isOneToOne: false;
            referencedRelation: "creatives";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "creative_directions_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      creative_versions: {
        Row: {
          asset_url: string | null;
          author: string | null;
          changes: string | null;
          comment: string | null;
          created_at: string;
          creative_id: string;
          id: string;
          updated_at: string;
          version: number;
          workspace_id: string;
        };
        Insert: {
          asset_url?: string | null;
          author?: string | null;
          changes?: string | null;
          comment?: string | null;
          created_at?: string;
          creative_id: string;
          id?: string;
          updated_at?: string;
          version?: number;
          workspace_id: string;
        };
        Update: {
          asset_url?: string | null;
          author?: string | null;
          changes?: string | null;
          comment?: string | null;
          created_at?: string;
          creative_id?: string;
          id?: string;
          updated_at?: string;
          version?: number;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "creative_versions_creative_id_fkey";
            columns: ["creative_id"];
            isOneToOne: false;
            referencedRelation: "creatives";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "creative_versions_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      creatives: {
        Row: {
          angle_id: string | null;
          awareness: string | null;
          brief_id: string | null;
          client_id: string | null;
          code: string | null;
          copy_id: string | null;
          created_at: string;
          cta: string | null;
          due_date: string | null;
          format: string | null;
          funnel: string | null;
          headline: string | null;
          hook_id: string | null;
          hypothesis_actual: string | null;
          hypothesis_change: string | null;
          hypothesis_expectation: string | null;
          hypothesis_reason: string | null;
          hypothesis_result: string | null;
          id: string;
          is_demo: boolean;
          iteration_variable: string | null;
          name: string;
          objective: string | null;
          offer: string | null;
          owner: string | null;
          parent_id: string | null;
          platform: string | null;
          primary_text: string | null;
          priority: string;
          product: string | null;
          project_id: string | null;
          references_notes: string | null;
          score_clarity: number | null;
          score_cta: number | null;
          score_differentiation: number | null;
          score_hierarchy: number | null;
          score_hook: number | null;
          score_platform_fit: number | null;
          score_proof: number | null;
          score_relevance: number | null;
          seq: number | null;
          status: string;
          tags: string[] | null;
          thumbnail_url: string | null;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          angle_id?: string | null;
          awareness?: string | null;
          brief_id?: string | null;
          client_id?: string | null;
          code?: string | null;
          copy_id?: string | null;
          created_at?: string;
          cta?: string | null;
          due_date?: string | null;
          format?: string | null;
          funnel?: string | null;
          headline?: string | null;
          hook_id?: string | null;
          hypothesis_actual?: string | null;
          hypothesis_change?: string | null;
          hypothesis_expectation?: string | null;
          hypothesis_reason?: string | null;
          hypothesis_result?: string | null;
          id?: string;
          is_demo?: boolean;
          iteration_variable?: string | null;
          name: string;
          objective?: string | null;
          offer?: string | null;
          owner?: string | null;
          parent_id?: string | null;
          platform?: string | null;
          primary_text?: string | null;
          priority?: string;
          product?: string | null;
          project_id?: string | null;
          references_notes?: string | null;
          score_clarity?: number | null;
          score_cta?: number | null;
          score_differentiation?: number | null;
          score_hierarchy?: number | null;
          score_hook?: number | null;
          score_platform_fit?: number | null;
          score_proof?: number | null;
          score_relevance?: number | null;
          seq?: number | null;
          status?: string;
          tags?: string[] | null;
          thumbnail_url?: string | null;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          angle_id?: string | null;
          awareness?: string | null;
          brief_id?: string | null;
          client_id?: string | null;
          code?: string | null;
          copy_id?: string | null;
          created_at?: string;
          cta?: string | null;
          due_date?: string | null;
          format?: string | null;
          funnel?: string | null;
          headline?: string | null;
          hook_id?: string | null;
          hypothesis_actual?: string | null;
          hypothesis_change?: string | null;
          hypothesis_expectation?: string | null;
          hypothesis_reason?: string | null;
          hypothesis_result?: string | null;
          id?: string;
          is_demo?: boolean;
          iteration_variable?: string | null;
          name?: string;
          objective?: string | null;
          offer?: string | null;
          owner?: string | null;
          parent_id?: string | null;
          platform?: string | null;
          primary_text?: string | null;
          priority?: string;
          product?: string | null;
          project_id?: string | null;
          references_notes?: string | null;
          score_clarity?: number | null;
          score_cta?: number | null;
          score_differentiation?: number | null;
          score_hierarchy?: number | null;
          score_hook?: number | null;
          score_platform_fit?: number | null;
          score_proof?: number | null;
          score_relevance?: number | null;
          seq?: number | null;
          status?: string;
          tags?: string[] | null;
          thumbnail_url?: string | null;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "creatives_angle_id_fkey";
            columns: ["angle_id"];
            isOneToOne: false;
            referencedRelation: "angles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "creatives_brief_id_fkey";
            columns: ["brief_id"];
            isOneToOne: false;
            referencedRelation: "briefs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "creatives_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "creatives_copy_id_fkey";
            columns: ["copy_id"];
            isOneToOne: false;
            referencedRelation: "copy_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "creatives_hook_id_fkey";
            columns: ["hook_id"];
            isOneToOne: false;
            referencedRelation: "hooks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "creatives_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "creatives";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "creatives_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "creatives_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      crm_activities: {
        Row: {
          author: string | null;
          body: string | null;
          channel: string | null;
          client_id: string | null;
          created_at: string;
          happened_at: string;
          id: string;
          lead_id: string | null;
          title: string;
          type: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          author?: string | null;
          body?: string | null;
          channel?: string | null;
          client_id?: string | null;
          created_at?: string;
          happened_at?: string;
          id?: string;
          lead_id?: string | null;
          title: string;
          type?: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          author?: string | null;
          body?: string | null;
          channel?: string | null;
          client_id?: string | null;
          created_at?: string;
          happened_at?: string;
          id?: string;
          lead_id?: string | null;
          title?: string;
          type?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "crm_activities_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "crm_activities_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "crm_activities_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      follow_ups: {
        Row: {
          channel: string | null;
          client_id: string | null;
          created_at: string;
          done_on: string | null;
          due_on: string;
          id: string;
          lead_id: string | null;
          next_action: string | null;
          notes: string | null;
          number: number;
          owner: string | null;
          result: string | null;
          status: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          channel?: string | null;
          client_id?: string | null;
          created_at?: string;
          done_on?: string | null;
          due_on?: string;
          id?: string;
          lead_id?: string | null;
          next_action?: string | null;
          notes?: string | null;
          number?: number;
          owner?: string | null;
          result?: string | null;
          status?: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          channel?: string | null;
          client_id?: string | null;
          created_at?: string;
          done_on?: string | null;
          due_on?: string;
          id?: string;
          lead_id?: string | null;
          next_action?: string | null;
          notes?: string | null;
          number?: number;
          owner?: string | null;
          result?: string | null;
          status?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "follow_ups_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "follow_ups_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "follow_ups_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      hooks: {
        Row: {
          category: string;
          created_at: string;
          id: string;
          is_demo: boolean;
          is_favorite: boolean;
          notes: string | null;
          tags: string[] | null;
          text: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          category?: string;
          created_at?: string;
          id?: string;
          is_demo?: boolean;
          is_favorite?: boolean;
          notes?: string | null;
          tags?: string[] | null;
          text: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: string;
          is_demo?: boolean;
          is_favorite?: boolean;
          notes?: string | null;
          tags?: string[] | null;
          text?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "hooks_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      icps: {
        Row: {
          brief_id: string | null;
          client_id: string | null;
          created_at: string;
          demographics: string | null;
          description: string | null;
          desires: string | null;
          id: string;
          is_demo: boolean;
          name: string;
          objections: string | null;
          pains: string | null;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          brief_id?: string | null;
          client_id?: string | null;
          created_at?: string;
          demographics?: string | null;
          description?: string | null;
          desires?: string | null;
          id?: string;
          is_demo?: boolean;
          name: string;
          objections?: string | null;
          pains?: string | null;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          brief_id?: string | null;
          client_id?: string | null;
          created_at?: string;
          demographics?: string | null;
          description?: string | null;
          desires?: string | null;
          id?: string;
          is_demo?: boolean;
          name?: string;
          objections?: string | null;
          pains?: string | null;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "icps_brief_id_fkey";
            columns: ["brief_id"];
            isOneToOne: false;
            referencedRelation: "briefs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "icps_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "icps_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      import_errors: {
        Row: {
          created_at: string;
          id: string;
          import_job_id: string;
          message: string;
          raw: Json | null;
          row_number: number;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          import_job_id: string;
          message: string;
          raw?: Json | null;
          row_number?: number;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          import_job_id?: string;
          message?: string;
          raw?: Json | null;
          row_number?: number;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "import_errors_import_job_id_fkey";
            columns: ["import_job_id"];
            isOneToOne: false;
            referencedRelation: "import_jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "import_errors_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      import_jobs: {
        Row: {
          author: string | null;
          created_at: string;
          entity: string;
          failed: number;
          file_name: string | null;
          id: string;
          imported: number;
          mapping: Json;
          skipped: number;
          status: string;
          total_rows: number;
          updated: number;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          author?: string | null;
          created_at?: string;
          entity: string;
          failed?: number;
          file_name?: string | null;
          id?: string;
          imported?: number;
          mapping?: Json;
          skipped?: number;
          status?: string;
          total_rows?: number;
          updated?: number;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          author?: string | null;
          created_at?: string;
          entity?: string;
          failed?: number;
          file_name?: string | null;
          id?: string;
          imported?: number;
          mapping?: Json;
          skipped?: number;
          status?: string;
          total_rows?: number;
          updated?: number;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "import_jobs_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      insights: {
        Row: {
          action: string | null;
          client_id: string | null;
          created_at: string;
          creative_id: string | null;
          evidence: string | null;
          hypothesis: string | null;
          id: string;
          is_demo: boolean;
          observation: string | null;
          priority: string;
          project_id: string | null;
          status: string;
          title: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          action?: string | null;
          client_id?: string | null;
          created_at?: string;
          creative_id?: string | null;
          evidence?: string | null;
          hypothesis?: string | null;
          id?: string;
          is_demo?: boolean;
          observation?: string | null;
          priority?: string;
          project_id?: string | null;
          status?: string;
          title: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          action?: string | null;
          client_id?: string | null;
          created_at?: string;
          creative_id?: string | null;
          evidence?: string | null;
          hypothesis?: string | null;
          id?: string;
          is_demo?: boolean;
          observation?: string | null;
          priority?: string;
          project_id?: string | null;
          status?: string;
          title?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "insights_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "insights_creative_id_fkey";
            columns: ["creative_id"];
            isOneToOne: false;
            referencedRelation: "creatives";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "insights_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "insights_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      lead_contacts: {
        Row: {
          author: string | null;
          channel: string | null;
          contacted_on: string;
          created_at: string;
          id: string;
          lead_id: string;
          message: string | null;
          next_contact_on: string | null;
          notes: string | null;
          number: number;
          reply: string | null;
          result: string | null;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          author?: string | null;
          channel?: string | null;
          contacted_on?: string;
          created_at?: string;
          id?: string;
          lead_id: string;
          message?: string | null;
          next_contact_on?: string | null;
          notes?: string | null;
          number?: number;
          reply?: string | null;
          result?: string | null;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          author?: string | null;
          channel?: string | null;
          contacted_on?: string;
          created_at?: string;
          id?: string;
          lead_id?: string;
          message?: string | null;
          next_contact_on?: string | null;
          notes?: string | null;
          number?: number;
          reply?: string | null;
          result?: string | null;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lead_contacts_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lead_contacts_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          budget: string | null;
          city: string | null;
          client_id: string | null;
          closed_at: string | null;
          cnpj: string | null;
          company: string | null;
          contact_count: number;
          created_at: string;
          email: string | null;
          entry_date: string;
          fit: string | null;
          id: string;
          instagram: string | null;
          interest_service: string | null;
          is_demo: boolean;
          last_contact_at: string | null;
          loss_notes: string | null;
          loss_reason: string | null;
          lost_at: string | null;
          lost_by: string | null;
          name: string;
          need: string | null;
          next_action: string | null;
          next_contact_on: string | null;
          notes: string | null;
          nurture_interest: string | null;
          nurture_potential: string | null;
          nurture_reason: string | null;
          nurture_since: string | null;
          owner: string | null;
          pain: string | null;
          phone: string | null;
          potential_value: number | null;
          role_title: string | null;
          score: number;
          score_authority: number | null;
          score_engagement: number | null;
          score_financial: number | null;
          score_fit: number | null;
          score_need: number | null;
          score_urgency: number | null;
          segment: string | null;
          source: string | null;
          stage: string;
          state: string | null;
          status: string;
          tags: string[] | null;
          updated_at: string;
          urgency: string | null;
          website: string | null;
          whatsapp: string | null;
          workspace_id: string;
        };
        Insert: {
          budget?: string | null;
          city?: string | null;
          client_id?: string | null;
          closed_at?: string | null;
          cnpj?: string | null;
          company?: string | null;
          contact_count?: number;
          created_at?: string;
          email?: string | null;
          entry_date?: string;
          fit?: string | null;
          id?: string;
          instagram?: string | null;
          interest_service?: string | null;
          is_demo?: boolean;
          last_contact_at?: string | null;
          loss_notes?: string | null;
          loss_reason?: string | null;
          lost_at?: string | null;
          lost_by?: string | null;
          name: string;
          need?: string | null;
          next_action?: string | null;
          next_contact_on?: string | null;
          notes?: string | null;
          nurture_interest?: string | null;
          nurture_potential?: string | null;
          nurture_reason?: string | null;
          nurture_since?: string | null;
          owner?: string | null;
          pain?: string | null;
          phone?: string | null;
          potential_value?: number | null;
          role_title?: string | null;
          score?: number;
          score_authority?: number | null;
          score_engagement?: number | null;
          score_financial?: number | null;
          score_fit?: number | null;
          score_need?: number | null;
          score_urgency?: number | null;
          segment?: string | null;
          source?: string | null;
          stage?: string;
          state?: string | null;
          status?: string;
          tags?: string[] | null;
          updated_at?: string;
          urgency?: string | null;
          website?: string | null;
          whatsapp?: string | null;
          workspace_id: string;
        };
        Update: {
          budget?: string | null;
          city?: string | null;
          client_id?: string | null;
          closed_at?: string | null;
          cnpj?: string | null;
          company?: string | null;
          contact_count?: number;
          created_at?: string;
          email?: string | null;
          entry_date?: string;
          fit?: string | null;
          id?: string;
          instagram?: string | null;
          interest_service?: string | null;
          is_demo?: boolean;
          last_contact_at?: string | null;
          loss_notes?: string | null;
          loss_reason?: string | null;
          lost_at?: string | null;
          lost_by?: string | null;
          name?: string;
          need?: string | null;
          next_action?: string | null;
          next_contact_on?: string | null;
          notes?: string | null;
          nurture_interest?: string | null;
          nurture_potential?: string | null;
          nurture_reason?: string | null;
          nurture_since?: string | null;
          owner?: string | null;
          pain?: string | null;
          phone?: string | null;
          potential_value?: number | null;
          role_title?: string | null;
          score?: number;
          score_authority?: number | null;
          score_engagement?: number | null;
          score_financial?: number | null;
          score_fit?: number | null;
          score_need?: number | null;
          score_urgency?: number | null;
          segment?: string | null;
          source?: string | null;
          stage?: string;
          state?: string | null;
          status?: string;
          tags?: string[] | null;
          updated_at?: string;
          urgency?: string | null;
          website?: string | null;
          whatsapp?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leads_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leads_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      loss_reasons: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "loss_reasons_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      matrix_rows: {
        Row: {
          angle_id: string | null;
          audience: string | null;
          awareness: string | null;
          client_id: string | null;
          created_at: string;
          format: string | null;
          funnel: string | null;
          hook_id: string | null;
          hypothesis: string | null;
          id: string;
          is_demo: boolean;
          offer: string | null;
          platform: string | null;
          project_id: string | null;
          status: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          angle_id?: string | null;
          audience?: string | null;
          awareness?: string | null;
          client_id?: string | null;
          created_at?: string;
          format?: string | null;
          funnel?: string | null;
          hook_id?: string | null;
          hypothesis?: string | null;
          id?: string;
          is_demo?: boolean;
          offer?: string | null;
          platform?: string | null;
          project_id?: string | null;
          status?: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          angle_id?: string | null;
          audience?: string | null;
          awareness?: string | null;
          client_id?: string | null;
          created_at?: string;
          format?: string | null;
          funnel?: string | null;
          hook_id?: string | null;
          hypothesis?: string | null;
          id?: string;
          is_demo?: boolean;
          offer?: string | null;
          platform?: string | null;
          project_id?: string | null;
          status?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matrix_rows_angle_id_fkey";
            columns: ["angle_id"];
            isOneToOne: false;
            referencedRelation: "angles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matrix_rows_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matrix_rows_hook_id_fkey";
            columns: ["hook_id"];
            isOneToOne: false;
            referencedRelation: "hooks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matrix_rows_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matrix_rows_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      meeting_actions: {
        Row: {
          created_at: string;
          description: string;
          due_on: string | null;
          id: string;
          is_done: boolean;
          meeting_id: string;
          owner: string | null;
          task_id: string | null;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          due_on?: string | null;
          id?: string;
          is_done?: boolean;
          meeting_id: string;
          owner?: string | null;
          task_id?: string | null;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          due_on?: string | null;
          id?: string;
          is_done?: boolean;
          meeting_id?: string;
          owner?: string | null;
          task_id?: string | null;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meeting_actions_meeting_id_fkey";
            columns: ["meeting_id"];
            isOneToOne: false;
            referencedRelation: "meetings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meeting_actions_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meeting_actions_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      meetings: {
        Row: {
          agenda: string | null;
          client_id: string | null;
          created_at: string;
          decisions: string | null;
          id: string;
          lead_id: string | null;
          notes: string | null;
          objective: string | null;
          participants: string[] | null;
          scheduled_at: string;
          status: string;
          title: string;
          type: string | null;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          agenda?: string | null;
          client_id?: string | null;
          created_at?: string;
          decisions?: string | null;
          id?: string;
          lead_id?: string | null;
          notes?: string | null;
          objective?: string | null;
          participants?: string[] | null;
          scheduled_at?: string;
          status?: string;
          title: string;
          type?: string | null;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          agenda?: string | null;
          client_id?: string | null;
          created_at?: string;
          decisions?: string | null;
          id?: string;
          lead_id?: string | null;
          notes?: string | null;
          objective?: string | null;
          participants?: string[] | null;
          scheduled_at?: string;
          status?: string;
          title?: string;
          type?: string | null;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meetings_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meetings_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meetings_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          link: string | null;
          read_at: string | null;
          title: string;
          type: string;
          updated_at: string;
          user_id: string | null;
          workspace_id: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          link?: string | null;
          read_at?: string | null;
          title: string;
          type?: string;
          updated_at?: string;
          user_id?: string | null;
          workspace_id: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          link?: string | null;
          read_at?: string | null;
          title?: string;
          type?: string;
          updated_at?: string;
          user_id?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      offers: {
        Row: {
          bonuses: string | null;
          client_id: string | null;
          created_at: string;
          guarantee: string | null;
          id: string;
          is_demo: boolean;
          name: string;
          price: number | null;
          project_id: string | null;
          promise: string | null;
          updated_at: string;
          urgency: string | null;
          workspace_id: string;
        };
        Insert: {
          bonuses?: string | null;
          client_id?: string | null;
          created_at?: string;
          guarantee?: string | null;
          id?: string;
          is_demo?: boolean;
          name: string;
          price?: number | null;
          project_id?: string | null;
          promise?: string | null;
          updated_at?: string;
          urgency?: string | null;
          workspace_id: string;
        };
        Update: {
          bonuses?: string | null;
          client_id?: string | null;
          created_at?: string;
          guarantee?: string | null;
          id?: string;
          is_demo?: boolean;
          name?: string;
          price?: number | null;
          project_id?: string | null;
          promise?: string | null;
          updated_at?: string;
          urgency?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "offers_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "offers_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "offers_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      onboarding_steps: {
        Row: {
          created_at: string;
          done_at: string | null;
          group_name: string;
          id: string;
          is_done: boolean;
          label: string;
          notes: string | null;
          onboarding_id: string;
          owner: string | null;
          position: number;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          done_at?: string | null;
          group_name: string;
          id?: string;
          is_done?: boolean;
          label: string;
          notes?: string | null;
          onboarding_id: string;
          owner?: string | null;
          position?: number;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          done_at?: string | null;
          group_name?: string;
          id?: string;
          is_done?: boolean;
          label?: string;
          notes?: string | null;
          onboarding_id?: string;
          owner?: string | null;
          position?: number;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "onboarding_steps_onboarding_id_fkey";
            columns: ["onboarding_id"];
            isOneToOne: false;
            referencedRelation: "onboardings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "onboarding_steps_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      onboardings: {
        Row: {
          client_id: string;
          created_at: string;
          finished_on: string | null;
          id: string;
          notes: string | null;
          owner: string | null;
          started_on: string;
          status: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          client_id: string;
          created_at?: string;
          finished_on?: string | null;
          id?: string;
          notes?: string | null;
          owner?: string | null;
          started_on?: string;
          status?: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          client_id?: string;
          created_at?: string;
          finished_on?: string | null;
          id?: string;
          notes?: string | null;
          owner?: string | null;
          started_on?: string;
          status?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "onboardings_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "onboardings_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      performances: {
        Row: {
          campaign_id: string | null;
          clicks: number | null;
          client_id: string | null;
          conversions: number | null;
          created_at: string;
          creative_id: string | null;
          id: string;
          impressions: number | null;
          is_demo: boolean;
          leads: number | null;
          lpv: number | null;
          period_end: string | null;
          period_start: string | null;
          platform: string | null;
          project_id: string | null;
          purchases: number | null;
          reach: number | null;
          revenue: number | null;
          spend: number | null;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          campaign_id?: string | null;
          clicks?: number | null;
          client_id?: string | null;
          conversions?: number | null;
          created_at?: string;
          creative_id?: string | null;
          id?: string;
          impressions?: number | null;
          is_demo?: boolean;
          leads?: number | null;
          lpv?: number | null;
          period_end?: string | null;
          period_start?: string | null;
          platform?: string | null;
          project_id?: string | null;
          purchases?: number | null;
          reach?: number | null;
          revenue?: number | null;
          spend?: number | null;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          campaign_id?: string | null;
          clicks?: number | null;
          client_id?: string | null;
          conversions?: number | null;
          created_at?: string;
          creative_id?: string | null;
          id?: string;
          impressions?: number | null;
          is_demo?: boolean;
          leads?: number | null;
          lpv?: number | null;
          period_end?: string | null;
          period_start?: string | null;
          platform?: string | null;
          project_id?: string | null;
          purchases?: number | null;
          reach?: number | null;
          revenue?: number | null;
          spend?: number | null;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "performances_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "performances_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "performances_creative_id_fkey";
            columns: ["creative_id"];
            isOneToOne: false;
            referencedRelation: "creatives";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "performances_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "performances_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      process_steps: {
        Row: {
          created_at: string;
          default_days: number | null;
          id: string;
          label: string;
          position: number;
          process_id: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          default_days?: number | null;
          id?: string;
          label: string;
          position?: number;
          process_id: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          default_days?: number | null;
          id?: string;
          label?: string;
          position?: number;
          process_id?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "process_steps_process_id_fkey";
            columns: ["process_id"];
            isOneToOne: false;
            referencedRelation: "processes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "process_steps_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      processes: {
        Row: {
          category: string | null;
          client_id: string | null;
          created_at: string;
          default_days: number | null;
          description: string | null;
          id: string;
          is_demo: boolean;
          name: string;
          owner: string | null;
          project_id: string | null;
          recurrence: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          category?: string | null;
          client_id?: string | null;
          created_at?: string;
          default_days?: number | null;
          description?: string | null;
          id?: string;
          is_demo?: boolean;
          name: string;
          owner?: string | null;
          project_id?: string | null;
          recurrence?: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          category?: string | null;
          client_id?: string | null;
          created_at?: string;
          default_days?: number | null;
          description?: string | null;
          id?: string;
          is_demo?: boolean;
          name?: string;
          owner?: string | null;
          project_id?: string | null;
          recurrence?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "processes_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "processes_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "processes_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          client_id: string | null;
          created_at: string;
          description: string | null;
          id: string;
          is_demo: boolean;
          name: string;
          price: number | null;
          project_id: string | null;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          client_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_demo?: boolean;
          name: string;
          price?: number | null;
          project_id?: string | null;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          client_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_demo?: boolean;
          name?: string;
          price?: number | null;
          project_id?: string | null;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          current_workspace_id: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          onboarded: boolean;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          current_workspace_id?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          onboarded?: boolean;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          current_workspace_id?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          onboarded?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_current_workspace_id_fkey";
            columns: ["current_workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          client_id: string;
          created_at: string;
          ends_on: string | null;
          funnel: string | null;
          id: string;
          is_demo: boolean;
          name: string;
          notes: string | null;
          objective: string | null;
          owners: string[] | null;
          platforms: string[] | null;
          product: string | null;
          starts_on: string | null;
          status: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          client_id: string;
          created_at?: string;
          ends_on?: string | null;
          funnel?: string | null;
          id?: string;
          is_demo?: boolean;
          name: string;
          notes?: string | null;
          objective?: string | null;
          owners?: string[] | null;
          platforms?: string[] | null;
          product?: string | null;
          starts_on?: string | null;
          status?: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          client_id?: string;
          created_at?: string;
          ends_on?: string | null;
          funnel?: string | null;
          id?: string;
          is_demo?: boolean;
          name?: string;
          notes?: string | null;
          objective?: string | null;
          owners?: string[] | null;
          platforms?: string[] | null;
          product?: string | null;
          starts_on?: string | null;
          status?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "projects_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      reports: {
        Row: {
          client_id: string | null;
          created_at: string;
          data: Json;
          id: string;
          is_demo: boolean;
          next_tests: string | null;
          period_end: string | null;
          period_start: string | null;
          project_id: string | null;
          summary: string | null;
          title: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          client_id?: string | null;
          created_at?: string;
          data?: Json;
          id?: string;
          is_demo?: boolean;
          next_tests?: string | null;
          period_end?: string | null;
          period_start?: string | null;
          project_id?: string | null;
          summary?: string | null;
          title: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          client_id?: string | null;
          created_at?: string;
          data?: Json;
          id?: string;
          is_demo?: boolean;
          next_tests?: string | null;
          period_end?: string | null;
          period_start?: string | null;
          project_id?: string | null;
          summary?: string | null;
          title?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reports_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      research_items: {
        Row: {
          category: string | null;
          client_id: string | null;
          created_at: string;
          creative_id: string | null;
          id: string;
          is_demo: boolean;
          notes: string | null;
          screenshot_url: string | null;
          source: string | null;
          tags: string[] | null;
          title: string;
          updated_at: string;
          url: string | null;
          workspace_id: string;
        };
        Insert: {
          category?: string | null;
          client_id?: string | null;
          created_at?: string;
          creative_id?: string | null;
          id?: string;
          is_demo?: boolean;
          notes?: string | null;
          screenshot_url?: string | null;
          source?: string | null;
          tags?: string[] | null;
          title: string;
          updated_at?: string;
          url?: string | null;
          workspace_id: string;
        };
        Update: {
          category?: string | null;
          client_id?: string | null;
          created_at?: string;
          creative_id?: string | null;
          id?: string;
          is_demo?: boolean;
          notes?: string | null;
          screenshot_url?: string | null;
          source?: string | null;
          tags?: string[] | null;
          title?: string;
          updated_at?: string;
          url?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "research_items_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "research_items_creative_id_fkey";
            columns: ["creative_id"];
            isOneToOne: false;
            referencedRelation: "creatives";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "research_items_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      task_checklist_items: {
        Row: {
          created_at: string;
          id: string;
          is_done: boolean;
          label: string;
          position: number;
          task_id: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_done?: boolean;
          label: string;
          position?: number;
          task_id: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_done?: boolean;
          label?: string;
          position?: number;
          task_id?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "task_checklist_items_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "task_checklist_items_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          client_id: string | null;
          created_at: string;
          creative_id: string | null;
          description: string | null;
          done_at: string | null;
          due_on: string | null;
          id: string;
          is_demo: boolean;
          lead_id: string | null;
          notes: string | null;
          owner: string | null;
          priority: string;
          project_id: string | null;
          recurrence: string;
          recurrence_interval: number | null;
          status: string;
          tags: string[] | null;
          title: string;
          type: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          client_id?: string | null;
          created_at?: string;
          creative_id?: string | null;
          description?: string | null;
          done_at?: string | null;
          due_on?: string | null;
          id?: string;
          is_demo?: boolean;
          lead_id?: string | null;
          notes?: string | null;
          owner?: string | null;
          priority?: string;
          project_id?: string | null;
          recurrence?: string;
          recurrence_interval?: number | null;
          status?: string;
          tags?: string[] | null;
          title: string;
          type?: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          client_id?: string | null;
          created_at?: string;
          creative_id?: string | null;
          description?: string | null;
          done_at?: string | null;
          due_on?: string | null;
          id?: string;
          is_demo?: boolean;
          lead_id?: string | null;
          notes?: string | null;
          owner?: string | null;
          priority?: string;
          project_id?: string | null;
          recurrence?: string;
          recurrence_interval?: number | null;
          status?: string;
          tags?: string[] | null;
          title?: string;
          type?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_creative_id_fkey";
            columns: ["creative_id"];
            isOneToOne: false;
            referencedRelation: "creatives";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      traffic_routines: {
        Row: {
          cadence: string;
          client_id: string;
          created_at: string;
          id: string;
          is_done: boolean;
          label: string;
          last_done_at: string | null;
          owner: string | null;
          position: number;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          cadence?: string;
          client_id: string;
          created_at?: string;
          id?: string;
          is_done?: boolean;
          label: string;
          last_done_at?: string | null;
          owner?: string | null;
          position?: number;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          cadence?: string;
          client_id?: string;
          created_at?: string;
          id?: string;
          is_done?: boolean;
          label?: string;
          last_done_at?: string | null;
          owner?: string | null;
          position?: number;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "traffic_routines_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "traffic_routines_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      voc_items: {
        Row: {
          category: string | null;
          client_id: string | null;
          created_at: string;
          id: string;
          is_demo: boolean;
          quote: string;
          source: string | null;
          tags: string[] | null;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          category?: string | null;
          client_id?: string | null;
          created_at?: string;
          id?: string;
          is_demo?: boolean;
          quote: string;
          source?: string | null;
          tags?: string[] | null;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          category?: string | null;
          client_id?: string | null;
          created_at?: string;
          id?: string;
          is_demo?: boolean;
          quote?: string;
          source?: string | null;
          tags?: string[] | null;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "voc_items_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "voc_items_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      workspace_members: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      workspaces: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          owner_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          owner_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          owner_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_workspace_with_demo: {
        Args: { _name: string; _with_demo?: boolean };
        Returns: string;
      };
      is_workspace_member: { Args: { _workspace_id: string }; Returns: boolean };
      workspace_role: {
        Args: { _workspace_id: string };
        Returns: Database["public"]["Enums"]["app_role"];
      };
    };
    Enums: {
      app_role:
        | "admin"
        | "strategist"
        | "copywriter"
        | "designer"
        | "editor"
        | "traffic_manager"
        | "client";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "strategist",
        "copywriter",
        "designer",
        "editor",
        "traffic_manager",
        "client",
      ],
    },
  },
} as const;

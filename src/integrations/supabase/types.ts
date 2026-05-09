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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_events: {
        Row: {
          actor: string
          company_id: string | null
          company_name: string | null
          created_at: string
          description: string
          id: string
          owner_id: string
          type: string
        }
        Insert: {
          actor?: string
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          description: string
          id?: string
          owner_id: string
          type: string
        }
        Update: {
          actor?: string
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          description?: string
          id?: string
          owner_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          created_at: string
          error_rate: number
          id: string
          last_run: string | null
          name: string
          nodes: Json
          owner_id: string
          runs: number
          status: string
          trigger: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_rate?: number
          id?: string
          last_run?: string | null
          name: string
          nodes?: Json
          owner_id: string
          runs?: number
          status?: string
          trigger?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_rate?: number
          id?: string
          last_run?: string | null
          name?: string
          nodes?: Json
          owner_id?: string
          runs?: number
          status?: string
          trigger?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          company_id: string | null
          content: string
          created_at: string
          id: string
          owner_id: string
          role: string
        }
        Insert: {
          company_id?: string | null
          content: string
          created_at?: string
          id?: string
          owner_id: string
          role: string
        }
        Update: {
          company_id?: string | null
          content?: string
          created_at?: string
          id?: string
          owner_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          ae: string | null
          created_at: string
          domain: string | null
          employee_growth: string | null
          employees: number | null
          funding: string | null
          hq: string | null
          icp_score: number | null
          id: string
          industry: string | null
          last_activity: string | null
          name: string
          owner_id: string
          reply_rate: number
          risk_flags: string[]
          sdr: string | null
          stage: string | null
          status: Database["public"]["Enums"]["deal_status"]
          strategy: string[]
          tech_stack: string[]
          updated_at: string
          why_now: string | null
        }
        Insert: {
          ae?: string | null
          created_at?: string
          domain?: string | null
          employee_growth?: string | null
          employees?: number | null
          funding?: string | null
          hq?: string | null
          icp_score?: number | null
          id?: string
          industry?: string | null
          last_activity?: string | null
          name: string
          owner_id: string
          reply_rate?: number
          risk_flags?: string[]
          sdr?: string | null
          stage?: string | null
          status?: Database["public"]["Enums"]["deal_status"]
          strategy?: string[]
          tech_stack?: string[]
          updated_at?: string
          why_now?: string | null
        }
        Update: {
          ae?: string | null
          created_at?: string
          domain?: string | null
          employee_growth?: string | null
          employees?: number | null
          funding?: string | null
          hq?: string | null
          icp_score?: number | null
          id?: string
          industry?: string | null
          last_activity?: string | null
          name?: string
          owner_id?: string
          reply_rate?: number
          risk_flags?: string[]
          sdr?: string | null
          stage?: string | null
          status?: Database["public"]["Enums"]["deal_status"]
          strategy?: string[]
          tech_stack?: string[]
          updated_at?: string
          why_now?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          owner_id: string
          read_at: string | null
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          owner_id: string
          read_at?: string | null
          title: string
          type?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          owner_id?: string
          read_at?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stakeholders: {
        Row: {
          company_id: string
          copy: Json
          created_at: string
          email: string | null
          id: string
          influence: number
          last_touch: string | null
          linkedin_url: string | null
          name: string
          owner_id: string
          role: Database["public"]["Enums"]["stakeholder_role"] | null
          sentiment: Database["public"]["Enums"]["sentiment"]
          status: Database["public"]["Enums"]["stakeholder_status"]
          title: string | null
          touches: number
          updated_at: string
        }
        Insert: {
          company_id: string
          copy?: Json
          created_at?: string
          email?: string | null
          id?: string
          influence?: number
          last_touch?: string | null
          linkedin_url?: string | null
          name: string
          owner_id: string
          role?: Database["public"]["Enums"]["stakeholder_role"] | null
          sentiment?: Database["public"]["Enums"]["sentiment"]
          status?: Database["public"]["Enums"]["stakeholder_status"]
          title?: string | null
          touches?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          copy?: Json
          created_at?: string
          email?: string | null
          id?: string
          influence?: number
          last_touch?: string | null
          linkedin_url?: string | null
          name?: string
          owner_id?: string
          role?: Database["public"]["Enums"]["stakeholder_role"] | null
          sentiment?: Database["public"]["Enums"]["sentiment"]
          status?: Database["public"]["Enums"]["stakeholder_status"]
          title?: string | null
          touches?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stakeholders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      touchpoints: {
        Row: {
          actor: string | null
          channel: Database["public"]["Enums"]["channel"]
          company_id: string
          content: string | null
          created_at: string
          description: string | null
          direction: string
          id: string
          owner_id: string
          sentiment: string | null
          stakeholder_id: string | null
        }
        Insert: {
          actor?: string | null
          channel: Database["public"]["Enums"]["channel"]
          company_id: string
          content?: string | null
          created_at?: string
          description?: string | null
          direction: string
          id?: string
          owner_id: string
          sentiment?: string | null
          stakeholder_id?: string | null
        }
        Update: {
          actor?: string | null
          channel?: Database["public"]["Enums"]["channel"]
          company_id?: string
          content?: string | null
          created_at?: string
          description?: string | null
          direction?: string
          id?: string
          owner_id?: string
          sentiment?: string | null
          stakeholder_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "touchpoints_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "touchpoints_stakeholder_id_fkey"
            columns: ["stakeholder_id"]
            isOneToOne: false
            referencedRelation: "stakeholders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      app_role: "admin" | "user"
      channel: "email" | "linkedin" | "call" | "slack" | "ai"
      deal_status:
        | "active"
        | "replied"
        | "meeting_booked"
        | "ghosting"
        | "won"
        | "lost"
      sentiment: "positive" | "neutral" | "negative" | "unknown"
      stakeholder_role:
        | "Economic Buyer"
        | "Champion"
        | "Influencer"
        | "Blocker"
        | "End User"
      stakeholder_status:
        | "pending"
        | "contacted"
        | "replied"
        | "meeting_booked"
        | "ghosting"
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
      app_role: ["admin", "user"],
      channel: ["email", "linkedin", "call", "slack", "ai"],
      deal_status: [
        "active",
        "replied",
        "meeting_booked",
        "ghosting",
        "won",
        "lost",
      ],
      sentiment: ["positive", "neutral", "negative", "unknown"],
      stakeholder_role: [
        "Economic Buyer",
        "Champion",
        "Influencer",
        "Blocker",
        "End User",
      ],
      stakeholder_status: [
        "pending",
        "contacted",
        "replied",
        "meeting_booked",
        "ghosting",
      ],
    },
  },
} as const

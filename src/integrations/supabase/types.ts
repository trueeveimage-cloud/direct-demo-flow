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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      concept_requests: {
        Row: {
          business_name: string
          created_at: string
          email: string
          id: string
        }
        Insert: {
          business_name: string
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          business_name?: string
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          contact_reason: string
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
        }
        Insert: {
          contact_reason: string
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
        }
        Update: {
          contact_reason?: string
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
        }
        Relationships: []
      }
      order_submissions: {
        Row: {
          accent_color: string | null
          advance_booking_days: string | null
          appointment_lengths: string[] | null
          booking_services: Json | null
          brand_preferences: string | null
          buffer_time: string | null
          business_followups: Json | null
          business_name: string
          business_type: string | null
          company_name: string | null
          competitors: string | null
          concept_link: string | null
          contact_person: string | null
          country: string | null
          created_at: string
          current_website: string | null
          custom_pages: string[] | null
          customer_type: string | null
          email: string
          extra_notes: string | null
          google_business_link: string | null
          google_maps_address: string | null
          id: string
          is_read: boolean
          is_yearly_care_plan: boolean | null
          legal_pages: string[] | null
          max_bookings_per_day: string | null
          opening_hours: string | null
          org_number: string | null
          page_notes: string | null
          paid_at: string | null
          payment_amount: string | null
          payment_status: string
          phone: string | null
          primary_color: string | null
          selected_care_plan: string | null
          selected_language: string | null
          selected_package: string | null
          selected_pages: string[] | null
          selected_style: string | null
          seo_keywords: string | null
          services: string | null
          stripe_session_id: string | null
          submission_type: string
          terms_explanation: string | null
          updated_at: string
          uploaded_photos: string[] | null
          vat_number: string | null
          vat_verified: boolean | null
          wants_admin_panel: boolean | null
          wants_before_after: boolean | null
          wants_booking: boolean | null
          wants_checkout_system: boolean | null
          wants_google_maps: boolean | null
          wants_google_reviews: boolean | null
          website_goal: string | null
        }
        Insert: {
          accent_color?: string | null
          advance_booking_days?: string | null
          appointment_lengths?: string[] | null
          booking_services?: Json | null
          brand_preferences?: string | null
          buffer_time?: string | null
          business_followups?: Json | null
          business_name: string
          business_type?: string | null
          company_name?: string | null
          competitors?: string | null
          concept_link?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          current_website?: string | null
          custom_pages?: string[] | null
          customer_type?: string | null
          email: string
          extra_notes?: string | null
          google_business_link?: string | null
          google_maps_address?: string | null
          id?: string
          is_read?: boolean
          is_yearly_care_plan?: boolean | null
          legal_pages?: string[] | null
          max_bookings_per_day?: string | null
          opening_hours?: string | null
          org_number?: string | null
          page_notes?: string | null
          paid_at?: string | null
          payment_amount?: string | null
          payment_status?: string
          phone?: string | null
          primary_color?: string | null
          selected_care_plan?: string | null
          selected_language?: string | null
          selected_package?: string | null
          selected_pages?: string[] | null
          selected_style?: string | null
          seo_keywords?: string | null
          services?: string | null
          stripe_session_id?: string | null
          submission_type: string
          terms_explanation?: string | null
          updated_at?: string
          uploaded_photos?: string[] | null
          vat_number?: string | null
          vat_verified?: boolean | null
          wants_admin_panel?: boolean | null
          wants_before_after?: boolean | null
          wants_booking?: boolean | null
          wants_checkout_system?: boolean | null
          wants_google_maps?: boolean | null
          wants_google_reviews?: boolean | null
          website_goal?: string | null
        }
        Update: {
          accent_color?: string | null
          advance_booking_days?: string | null
          appointment_lengths?: string[] | null
          booking_services?: Json | null
          brand_preferences?: string | null
          buffer_time?: string | null
          business_followups?: Json | null
          business_name?: string
          business_type?: string | null
          company_name?: string | null
          competitors?: string | null
          concept_link?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          current_website?: string | null
          custom_pages?: string[] | null
          customer_type?: string | null
          email?: string
          extra_notes?: string | null
          google_business_link?: string | null
          google_maps_address?: string | null
          id?: string
          is_read?: boolean
          is_yearly_care_plan?: boolean | null
          legal_pages?: string[] | null
          max_bookings_per_day?: string | null
          opening_hours?: string | null
          org_number?: string | null
          page_notes?: string | null
          paid_at?: string | null
          payment_amount?: string | null
          payment_status?: string
          phone?: string | null
          primary_color?: string | null
          selected_care_plan?: string | null
          selected_language?: string | null
          selected_package?: string | null
          selected_pages?: string[] | null
          selected_style?: string | null
          seo_keywords?: string | null
          services?: string | null
          stripe_session_id?: string | null
          submission_type?: string
          terms_explanation?: string | null
          updated_at?: string
          uploaded_photos?: string[] | null
          vat_number?: string | null
          vat_verified?: boolean | null
          wants_admin_panel?: boolean | null
          wants_before_after?: boolean | null
          wants_booking?: boolean | null
          wants_checkout_system?: boolean | null
          wants_google_maps?: boolean | null
          wants_google_reviews?: boolean | null
          website_goal?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_remaining_spots: { Args: never; Returns: number }
      is_admin_user: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

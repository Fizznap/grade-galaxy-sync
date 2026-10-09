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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      data_imports: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          filename: string
          id: string
          message: string
          row_count: number
          status: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          filename: string
          id?: string
          message?: string
          row_count?: number
          status?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          filename?: string
          id?: string
          message?: string
          row_count?: number
          status?: string
        }
        Relationships: []
      }

      academic_records: {
        Row: {
          id: string
          student_id: string
          import_id: string | null
          source_record_hash: string
          supersedes_record_id: string | null
          semester: number
          subject_code: string
          credits: number
          grade_points: number
          is_backlog: boolean
          recorded_at: string
        }
        Insert: {
          id?: string
          student_id: string
          import_id?: string | null
          source_record_hash: string
          supersedes_record_id?: string | null
          semester: number
          subject_code: string
          credits: number
          grade_points: number
          is_backlog?: boolean
          recorded_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          import_id?: string | null
          source_record_hash?: string
          supersedes_record_id?: string | null
          semester?: number
          subject_code?: string
          credits?: number
          grade_points?: number
          is_backlog?: boolean
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      attendance_records: {
        Row: {
          id: string
          student_id: string
          import_id: string | null
          source_record_hash: string
          supersedes_record_id: string | null
          date: string
          subject_code: string | null
          classes_total: number | null
          classes_attended: number | null
          percentage: number | null
          recorded_at: string
        }
        Insert: {
          id?: string
          student_id: string
          import_id?: string | null
          source_record_hash: string
          supersedes_record_id?: string | null
          date: string
          subject_code?: string | null
          classes_total?: number | null
          classes_attended?: number | null
          percentage?: number | null
          recorded_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          import_id?: string | null
          source_record_hash?: string
          supersedes_record_id?: string | null
          date?: string
          subject_code?: string | null
          classes_total?: number | null
          classes_attended?: number | null
          percentage?: number | null
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      lms_activity_records: {
        Row: {
          id: string
          student_id: string
          import_id: string | null
          source_record_hash: string
          supersedes_record_id: string | null
          date: string
          session_id: string | null
          activity_type: string
          duration_minutes: number | null
          recorded_at: string
        }
        Insert: {
          id?: string
          student_id: string
          import_id?: string | null
          source_record_hash: string
          supersedes_record_id?: string | null
          date: string
          session_id?: string | null
          activity_type: string
          duration_minutes?: number | null
          recorded_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          import_id?: string | null
          source_record_hash?: string
          supersedes_record_id?: string | null
          date?: string
          session_id?: string | null
          activity_type?: string
          duration_minutes?: number | null
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lms_activity_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      engagement_records: {
        Row: {
          id: string
          student_id: string
          import_id: string | null
          source_record_hash: string
          supersedes_record_id: string | null
          event_date: string
          activity_type: string
          points: number
          recorded_at: string
        }
        Insert: {
          id?: string
          student_id: string
          import_id?: string | null
          source_record_hash: string
          supersedes_record_id?: string | null
          event_date: string
          activity_type: string
          points: number
          recorded_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          import_id?: string | null
          source_record_hash?: string
          supersedes_record_id?: string | null
          event_date?: string
          activity_type?: string
          points?: number
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      placement_records: {
        Row: {
          id: string
          student_id: string
          import_id: string | null
          source_record_hash: string
          supersedes_record_id: string | null
          assessment_date: string
          assessment_type: string
          attempt_number: number
          score: number
          max_score: number
          recorded_at: string
        }
        Insert: {
          id?: string
          student_id: string
          import_id?: string | null
          source_record_hash: string
          supersedes_record_id?: string | null
          assessment_date: string
          assessment_type: string
          attempt_number?: number
          score: number
          max_score: number
          recorded_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          import_id?: string | null
          source_record_hash?: string
          supersedes_record_id?: string | null
          assessment_date?: string
          assessment_type?: string
          attempt_number?: number
          score?: number
          max_score?: number
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "placement_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      skills_records: {
        Row: {
          id: string
          student_id: string
          import_id: string | null
          source_record_hash: string
          supersedes_record_id: string | null
          assessment_date: string
          skill_name: string
          score: number
          max_score: number
          recorded_at: string
        }
        Insert: {
          id?: string
          student_id: string
          import_id?: string | null
          source_record_hash: string
          supersedes_record_id?: string | null
          assessment_date: string
          skill_name: string
          score: number
          max_score: number
          recorded_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          import_id?: string | null
          source_record_hash?: string
          supersedes_record_id?: string | null
          assessment_date?: string
          skill_name?: string
          score?: number
          max_score?: number
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      feedback_records: {
        Row: {
          id: string
          student_id: string
          submitted_by: string
          category: string
          score: number | null
          max_score: number | null
          notes: string | null
          is_confidential: boolean
          recorded_at: string
        }
        Insert: {
          id?: string
          student_id: string
          submitted_by: string
          category: string
          score?: number | null
          max_score?: number | null
          notes?: string | null
          is_confidential?: boolean
          recorded_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          submitted_by?: string
          category?: string
          score?: number | null
          max_score?: number | null
          notes?: string | null
          is_confidential?: boolean
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      interventions: {
        Row: {
          assigned_to: string
          category: string
          created_at: string
          created_by: string | null
          due_date: string | null
          id: string
          notes: string
          priority: string
          status: string
          student_id: string
          title: string
        }
        Insert: {
          assigned_to?: string
          category?: string
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          notes?: string
          priority?: string
          status?: string
          student_id: string
          title: string
        }
        Update: {
          assigned_to?: string
          category?: string
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          notes?: string
          priority?: string
          status?: string
          student_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "interventions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_reads: {
        Row: {
          notification_key: string
          read_at: string
          user_id: string
        }
        Insert: {
          notification_key: string
          read_at?: string
          user_id: string
        }
        Update: {
          notification_key?: string
          read_at?: string
          user_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          attendance: number
          backlogs: number
          cgpa: number
          created_at: string
          department: string
          engagement: number
          feedback_score: number
          id: string
          lms_activity: number
          name: string
          placement_readiness: number
          roll_no: string
          skills_score: number
          updated_at: string
          year: number
          user_id: string | null
        }
        Insert: {
          attendance?: number
          backlogs?: number
          cgpa?: number
          created_at?: string
          department: string
          engagement?: number
          feedback_score?: number
          id?: string
          lms_activity?: number
          name: string
          placement_readiness?: number
          roll_no: string
          skills_score?: number
          updated_at?: string
          year?: number
          user_id?: string | null
        }
        Update: {
          attendance?: number
          backlogs?: number
          cgpa?: number
          created_at?: string
          department?: string
          engagement?: number
          feedback_score?: number
          id?: string
          lms_activity?: number
          name?: string
          placement_readiness?: number
          roll_no?: string
          skills_score?: number
          updated_at?: string
          year?: number
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      import_domain_data: {
        Args: {
          p_category: string
          p_import_hash: string
          p_filename: string
          p_records: Json
        }
        Returns: Json
      }

    }
    Enums: {
      app_role: "admin" | "faculty" | "placement" | "pending" | "student"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "faculty", "placement", "pending", "student"],
    },
  },
} as const

const fs = require('fs');
const path = require('path');

const typesPath = path.join(__dirname, '../src/integrations/supabase/types.ts');
let content = fs.readFileSync(typesPath, 'utf8');

const newTables = `
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
      }`;

if (!content.includes('academic_records')) {
  // inject after 'interventions: {'
  content = content.replace(
    '      interventions: {',
    newTables + '\n      interventions: {'
  );
  fs.writeFileSync(typesPath, content);
  console.log('types.ts patched');
} else {
  console.log('types.ts already patched');
}

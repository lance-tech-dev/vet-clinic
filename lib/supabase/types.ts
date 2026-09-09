export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      branches: {
        Row: {
          id: string;
          name: string;
          city: string;
          address: string;
          phone: string;
          operating_hours: string;
          gmap_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          city: string;
          address: string;
          phone: string;
          operating_hours?: string;
          gmap_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          city?: string;
          address?: string;
          phone?: string;
          operating_hours?: string;
          gmap_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      staff_members: {
        Row: {
          id: string;
          branch_id: string;
          full_name: string;
          role_title: string;
          specialization: string | null;
          avatar_url: string | null;
          phone: string | null;
          email: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          branch_id: string;
          full_name: string;
          role_title: string;
          specialization?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          email?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          branch_id?: string;
          full_name?: string;
          role_title?: string;
          specialization?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          email?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "staff_members_branch_id_fkey";
            columns: ["branch_id"];
            referencedRelation: "branches";
            referencedColumns: ["id"];
          }
        ];
      };
      appointments: {
        Row: {
          id: string;
          user_id: string;
          branch_id: string;
          service_name: string;
          appointment_date: string;
          time_slot: string;
          owner_name: string;
          phone: string;
          pet_name: string;
          species_breed: string;
          notes: string | null;
          status: "scheduled" | "completed" | "cancelled";
          reschedule_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          branch_id: string;
          service_name: string;
          appointment_date: string;
          time_slot: string;
          owner_name: string;
          phone: string;
          pet_name: string;
          species_breed: string;
          notes?: string | null;
          status?: "scheduled" | "completed" | "cancelled";
          reschedule_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          branch_id?: string;
          service_name?: string;
          appointment_date?: string;
          time_slot?: string;
          owner_name?: string;
          phone?: string;
          pet_name?: string;
          species_breed?: string;
          notes?: string | null;
          status?: "scheduled" | "completed" | "cancelled";
          reschedule_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_branch_id_fkey";
            columns: ["branch_id"];
            referencedRelation: "branches";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: "admin" | "staff" | "user";
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          role?: "admin" | "staff" | "user";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: "admin" | "staff" | "user";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      pets: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          species: string;
          breed: string | null;
          sex: string;
          is_neutered: boolean;
          date_of_birth: string | null;
          microchip_no: string | null;
          color_markings: string | null;
          owner_name: string | null;
          owner_address: string | null;
          owner_phone: string | null;
          owner_email: string | null;
          authorized_handlers: string | null;
          age: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          species: string;
          breed?: string | null;
          sex?: string;
          is_neutered?: boolean;
          date_of_birth?: string | null;
          microchip_no?: string | null;
          color_markings?: string | null;
          owner_name?: string | null;
          owner_address?: string | null;
          owner_phone?: string | null;
          owner_email?: string | null;
          authorized_handlers?: string | null;
          age?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          species?: string;
          breed?: string | null;
          sex?: string;
          is_neutered?: boolean;
          date_of_birth?: string | null;
          microchip_no?: string | null;
          color_markings?: string | null;
          owner_name?: string | null;
          owner_address?: string | null;
          owner_phone?: string | null;
          owner_email?: string | null;
          authorized_handlers?: string | null;
          age?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pets_owner_id_fkey";
            columns: ["owner_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      pet_grooming_logs: {
        Row: {
          id: string;
          pet_id: string;
          log_date: string;
          is_grooming: boolean;
          is_boarding: boolean;
          medical_history: string | null;
          medications_supplements: string | null;
          special_needs_preferences: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          log_date?: string;
          is_grooming?: boolean;
          is_boarding?: boolean;
          medical_history?: string | null;
          medications_supplements?: string | null;
          special_needs_preferences?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pet_id?: string;
          log_date?: string;
          is_grooming?: boolean;
          is_boarding?: boolean;
          medical_history?: string | null;
          medications_supplements?: string | null;
          special_needs_preferences?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pet_grooming_logs_pet_id_fkey";
            columns: ["pet_id"];
            referencedRelation: "pets";
            referencedColumns: ["id"];
          }
        ];
      };
      pet_vaccination_logs: {
        Row: {
          id: string;
          pet_id: string;
          date_given: string;
          weight_kg: number | null;
          against_disease: string;
          vaccine_used: string;
          lot_batch_no: string | null;
          next_due: string | null;
          veterinarian: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          date_given: string;
          weight_kg?: number | null;
          against_disease: string;
          vaccine_used: string;
          lot_batch_no?: string | null;
          next_due?: string | null;
          veterinarian: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pet_id?: string;
          date_given?: string;
          weight_kg?: number | null;
          against_disease?: string;
          vaccine_used?: string;
          lot_batch_no?: string | null;
          next_due?: string | null;
          veterinarian?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pet_vaccination_logs_pet_id_fkey";
            columns: ["pet_id"];
            referencedRelation: "pets";
            referencedColumns: ["id"];
          }
        ];
      };
      pet_parasite_preventative_logs: {
        Row: {
          id: string;
          pet_id: string;
          date_given: string;
          weight_kg: number | null;
          against_parasites: string;
          preventative_used: string;
          next_due: string | null;
          veterinarian: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          date_given: string;
          weight_kg?: number | null;
          against_parasites: string;
          preventative_used: string;
          next_due?: string | null;
          veterinarian: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pet_id?: string;
          date_given?: string;
          weight_kg?: number | null;
          against_parasites?: string;
          preventative_used?: string;
          next_due?: string | null;
          veterinarian?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pet_parasite_preventative_logs_pet_id_fkey";
            columns: ["pet_id"];
            referencedRelation: "pets";
            referencedColumns: ["id"];
          }
        ];
      };
      pet_medical_visit_logs: {
        Row: {
          id: string;
          pet_id: string;
          visit_date: string;
          reason_for_visit: string;
          clinical_findings: string;
          vet_instructions: string;
          follow_up_date: string | null;
          veterinarian: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          visit_date?: string;
          reason_for_visit: string;
          clinical_findings: string;
          vet_instructions: string;
          follow_up_date?: string | null;
          veterinarian: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pet_id?: string;
          visit_date?: string;
          reason_for_visit?: string;
          clinical_findings?: string;
          vet_instructions?: string;
          follow_up_date?: string | null;
          veterinarian?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pet_medical_visit_logs_pet_id_fkey";
            columns: ["pet_id"];
            referencedRelation: "pets";
            referencedColumns: ["id"];
          }
        ];
      };
      pet_dental_logs: {
        Row: {
          id: string;
          pet_id: string;
          record_date: string;
          has_salivation: boolean;
          has_periodontal_disease: boolean;
          tooth_conditions: Json;
          notes: string | null;
          veterinarian: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          record_date?: string;
          has_salivation?: boolean;
          has_periodontal_disease?: boolean;
          tooth_conditions?: Json;
          notes?: string | null;
          veterinarian?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pet_id?: string;
          record_date?: string;
          has_salivation?: boolean;
          has_periodontal_disease?: boolean;
          tooth_conditions?: Json;
          notes?: string | null;
          veterinarian?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pet_dental_logs_pet_id_fkey";
            columns: ["pet_id"];
            referencedRelation: "pets";
            referencedColumns: ["id"];
          }
        ];
      };
      media_assets: {
        Row: {
          id: string;
          filename: string;
          storage_key: string;
          url: string;
          mime_type: string;
          size_bytes: number;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          filename: string;
          storage_key: string;
          url: string;
          mime_type: string;
          size_bytes: number;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          filename?: string;
          storage_key?: string;
          url?: string;
          mime_type?: string;
          size_bytes?: number;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "media_assets_uploaded_by_fkey";
            columns: ["uploaded_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: {
          user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "admin" | "staff" | "user";
      appointment_status: "scheduled" | "completed" | "cancelled";
    };
  };
}
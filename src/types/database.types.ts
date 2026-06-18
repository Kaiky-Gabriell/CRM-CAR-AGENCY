export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          created_at: string
          settings: Json | null
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          settings?: Json | null
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          settings?: Json | null
        }
      }
      customers: {
        Row: {
          id: string
          company_id: string
          name: string
          phone: string | null
          email: string | null
          source: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          phone?: string | null
          email?: string | null
          source?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          phone?: string | null
          email?: string | null
          source?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      deals: {
        Row: {
          id: string
          company_id: string
          customer_id: string
          title: string
          vehicle_interest: string | null
          estimated_value: number | null
          stage: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          customer_id: string
          title: string
          vehicle_interest?: string | null
          estimated_value?: number | null
          stage?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          customer_id?: string
          title?: string
          vehicle_interest?: string | null
          estimated_value?: number | null
          stage?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          company_id: string
          deal_id: string | null
          customer_id: string | null
          action: string
          details: Json | null
          created_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          company_id: string
          deal_id?: string | null
          customer_id?: string | null
          action: string
          details?: Json | null
          created_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          deal_id?: string | null
          customer_id?: string | null
          action?: string
          details?: Json | null
          created_at?: string
          user_id?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          company_id: string
          deal_id: string | null
          title: string
          due_date: string | null
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          deal_id?: string | null
          title: string
          due_date?: string | null
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          deal_id?: string | null
          title?: string
          due_date?: string | null
          completed?: boolean
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          company_id: string
          deal_id: string | null
          name: string
          file_url: string
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          deal_id?: string | null
          name: string
          file_url: string
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          deal_id?: string | null
          name?: string
          file_url?: string
          created_at?: string
        }
      }
    }
  }
}

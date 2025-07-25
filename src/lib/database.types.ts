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
      listings: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          user_id: string
          created_at: string
          expires_at: string
          is_paid: boolean
          images: string[]
          location: string
          street: string | null
          number: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          contact_info: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          user_id: string
          created_at?: string
          expires_at: string
          is_paid?: boolean
          images?: string[]
          location: string
          street?: string | null
          number?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          contact_info?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          user_id?: string
          created_at?: string
          expires_at?: string
          is_paid?: boolean
          images?: string[]
          location?: string
          street?: string | null
          number?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          contact_info?: string | null
        }
      }
      listing_payments: {
        Row: {
          id: string
          listing_id: string
          user_id: string
          amount: number
          status: string
          stripe_session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          user_id: string
          amount: number
          status: string
          stripe_session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          user_id?: string
          amount?: number
          status?: string
          stripe_session_id?: string | null
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          created_at?: string
        }
      }
      images: {
        Row: {
          id: string
          listing_id: string
          url: string
          storage_path: string
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          url: string
          storage_path: string
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          url?: string
          storage_path?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
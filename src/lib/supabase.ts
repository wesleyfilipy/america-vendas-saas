import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

// Supabase configuration
const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.anonKey;

console.log('Supabase Configuration:', {
  url: supabaseUrl,
  keyAvailable: !!supabaseKey,
  keyLength: supabaseKey?.length || 0
});

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    debug: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
  },
});

// Error handling utility
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error_description) {
    return error.error_description;
  }
  
  return 'Ocorreu um erro inesperado. Tente novamente.';
};

// Database types
export interface Database {
  public: {
    Tables: {
      listings: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          category: string;
          street: string;
          number: string;
          city: string;
          state: string;
          zip_code: string;
          contact_info: string;
          user_id: string;
          is_paid: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          price: number;
          category: string;
          street: string;
          number: string;
          city: string;
          state: string;
          zip_code: string;
          contact_info: string;
          user_id: string;
          is_paid?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          price?: number;
          category?: string;
          street?: string;
          number?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          contact_info?: string;
          user_id?: string;
          is_paid?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      images: {
        Row: {
          id: string;
          listing_id: string;
          url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          url?: string;
          created_at?: string;
        };
      };
      listing_payments: {
        Row: {
          id: string;
          listing_id: string;
          user_id: string;
          stripe_session_id: string;
          amount: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          user_id: string;
          stripe_session_id: string;
          amount: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          user_id?: string;
          stripe_session_id?: string;
          amount?: number;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Listing = Database['public']['Tables']['listings']['Row'];
export type Image = Database['public']['Tables']['images']['Row'];
export type ListingPayment = Database['public']['Tables']['listing_payments']['Row'];

// Listing functions
export const createListing = async (listingData: Omit<Database['public']['Tables']['listings']['Insert'], 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .insert([listingData])
      .select()
      .single();

    if (error) throw error;
    return { id: data.id, ...data };
  } catch (error) {
    console.error('Error creating listing:', error);
    return { error: handleSupabaseError(error) };
  }
};

export const uploadListingImages = async (listingId: string, images: File[]): Promise<string[]> => {
  const imageUrls: string[] = [];
  
  try {
    for (const image of images) {
      const fileName = `${listingId}/${Date.now()}-${image.name}`;
      const { data, error } = await supabase.storage
        .from('listing-images')
        .upload(fileName, image);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName);

      imageUrls.push(publicUrl);

      // Save image record to database
      await supabase
        .from('images')
        .insert({
          listing_id: listingId,
          url: publicUrl
        });
    }

    return imageUrls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

export const updateListingPaymentStatus = async (listingId: string, isPaid: boolean) => {
  try {
    const { error } = await supabase
      .from('listings')
      .update({ is_paid: isPaid })
      .eq('id', listingId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return { error: handleSupabaseError(error) };
  }
};

// Auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase Auth State Change:', { event, session });
}); 
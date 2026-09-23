export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string;
          country: string;
          created_at: string;
          full_name: string;
          id: string;
          is_default: boolean;
          label: string | null;
          line1: string;
          line2: string | null;
          phone: string | null;
          postal_code: string;
          region: string;
          type: Database["public"]["Enums"]["address_type"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          city: string;
          country?: string;
          created_at?: string;
          full_name: string;
          id?: string;
          is_default?: boolean;
          label?: string | null;
          line1: string;
          line2?: string | null;
          phone?: string | null;
          postal_code: string;
          region: string;
          type: Database["public"]["Enums"]["address_type"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          city?: string;
          country?: string;
          created_at?: string;
          full_name?: string;
          id?: string;
          is_default?: boolean;
          label?: string | null;
          line1?: string;
          line2?: string | null;
          phone?: string | null;
          postal_code?: string;
          region?: string;
          type?: Database["public"]["Enums"]["address_type"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      cart_items: {
        Row: {
          created_at: string;
          id: string;
          quantity: number;
          updated_at: string;
          user_id: string;
          variant_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          quantity: number;
          updated_at?: string;
          user_id: string;
          variant_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          quantity?: number;
          updated_at?: string;
          user_id?: string;
          variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image_path: string | null;
          is_active: boolean;
          name: string;
          parent_id: string | null;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_path?: string | null;
          is_active?: boolean;
          name: string;
          parent_id?: string | null;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_path?: string | null;
          is_active?: boolean;
          name?: string;
          parent_id?: string | null;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          color: string;
          created_at: string;
          id: string;
          image_path: string | null;
          order_id: string;
          product_name: string;
          quantity: number;
          size: string;
          sku: string;
          unit_price_cents: number;
          variant_id: string | null;
        };
        Insert: {
          color: string;
          created_at?: string;
          id?: string;
          image_path?: string | null;
          order_id: string;
          product_name: string;
          quantity: number;
          size: string;
          sku: string;
          unit_price_cents: number;
          variant_id?: string | null;
        };
        Update: {
          color?: string;
          created_at?: string;
          id?: string;
          image_path?: string | null;
          order_id?: string;
          product_name?: string;
          quantity?: number;
          size?: string;
          sku?: string;
          unit_price_cents?: number;
          variant_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          billing_address: Json;
          created_at: string;
          currency: string;
          email: string;
          fulfillment_status: Database["public"]["Enums"]["fulfillment_status"];
          id: string;
          notes: string | null;
          order_number: string;
          payment_intent_id: string | null;
          payment_status: Database["public"]["Enums"]["payment_status"];
          placed_at: string;
          shipping_address: Json;
          shipping_cents: number;
          status: Database["public"]["Enums"]["order_status"];
          subtotal_cents: number;
          tax_cents: number;
          total_cents: number;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          billing_address: Json;
          created_at?: string;
          currency?: string;
          email: string;
          fulfillment_status?: Database["public"]["Enums"]["fulfillment_status"];
          id?: string;
          notes?: string | null;
          order_number: string;
          payment_intent_id?: string | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          placed_at?: string;
          shipping_address: Json;
          shipping_cents?: number;
          status?: Database["public"]["Enums"]["order_status"];
          subtotal_cents: number;
          tax_cents?: number;
          total_cents: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          billing_address?: Json;
          created_at?: string;
          currency?: string;
          email?: string;
          fulfillment_status?: Database["public"]["Enums"]["fulfillment_status"];
          id?: string;
          notes?: string | null;
          order_number?: string;
          payment_intent_id?: string | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          placed_at?: string;
          shipping_address?: Json;
          shipping_cents?: number;
          status?: Database["public"]["Enums"]["order_status"];
          subtotal_cents?: number;
          tax_cents?: number;
          total_cents?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          alt: string;
          created_at: string;
          id: string;
          is_primary: boolean;
          product_id: string;
          sort_order: number;
          storage_path: string;
        };
        Insert: {
          alt: string;
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          product_id: string;
          sort_order?: number;
          storage_path: string;
        };
        Update: {
          alt?: string;
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          product_id?: string;
          sort_order?: number;
          storage_path?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_variants: {
        Row: {
          color: string;
          color_hex: string | null;
          compare_at_cents: number | null;
          created_at: string;
          id: string;
          image_path: string | null;
          is_active: boolean;
          price_cents: number;
          product_id: string;
          size: string;
          sku: string;
          stock: number;
          updated_at: string;
        };
        Insert: {
          color: string;
          color_hex?: string | null;
          compare_at_cents?: number | null;
          created_at?: string;
          id?: string;
          image_path?: string | null;
          is_active?: boolean;
          price_cents: number;
          product_id: string;
          size: string;
          sku: string;
          stock?: number;
          updated_at?: string;
        };
        Update: {
          color?: string;
          color_hex?: string | null;
          compare_at_cents?: number | null;
          created_at?: string;
          id?: string;
          image_path?: string | null;
          is_active?: boolean;
          price_cents?: number;
          product_id?: string;
          size?: string;
          sku?: string;
          stock?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          care_instructions: string | null;
          category_id: string;
          created_at: string;
          description: string;
          id: string;
          is_featured: boolean;
          material: string | null;
          name: string;
          published_at: string | null;
          slug: string;
          status: Database["public"]["Enums"]["product_status"];
          updated_at: string;
        };
        Insert: {
          care_instructions?: string | null;
          category_id: string;
          created_at?: string;
          description?: string;
          id?: string;
          is_featured?: boolean;
          material?: string | null;
          name: string;
          published_at?: string | null;
          slug: string;
          status?: Database["public"]["Enums"]["product_status"];
          updated_at?: string;
        };
        Update: {
          care_instructions?: string | null;
          category_id?: string;
          created_at?: string;
          description?: string;
          id?: string;
          is_featured?: boolean;
          material?: string | null;
          name?: string;
          published_at?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["product_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          phone: string | null;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      wishlists: {
        Row: {
          created_at: string;
          id: string;
          product_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          product_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          product_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wishlists_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_order: {
        Args: {
          p_billing_address: Json;
          p_email: string;
          p_items: Json;
          p_notes?: string;
          p_shipping_address: Json;
        };
        Returns: string;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      next_order_number: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      address_type: "shipping" | "billing";
      fulfillment_status: "unfulfilled" | "partial" | "fulfilled";
      order_status: "pending" | "confirmed" | "fulfilled" | "cancelled";
      payment_status: "unpaid" | "paid" | "failed" | "refunded";
      product_status: "draft" | "published" | "archived";
      user_role: "customer" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

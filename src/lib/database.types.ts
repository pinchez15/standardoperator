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
      arcade_requests: {
        Row: {
          admin_response: Json | null;
          created_at: string;
          game_type: string;
          id: string;
          notes: string | null;
          sop_id: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          admin_response?: Json | null;
          created_at?: string;
          game_type: string;
          id?: string;
          notes?: string | null;
          sop_id: string;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          admin_response?: Json | null;
          created_at?: string;
          game_type?: string;
          id?: string;
          notes?: string | null;
          sop_id?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      sop_exports: {
        Row: {
          created_at: string;
          format: string;
          id: string;
          meta: Json;
          sop_id: string;
          storage_path: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          format: string;
          id?: string;
          meta?: Json;
          sop_id: string;
          storage_path: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          format?: string;
          id?: string;
          meta?: Json;
          sop_id?: string;
          storage_path?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      sop_folders: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      sops: {
        Row: {
          content: Json;
          created_at: string;
          folder_id: string | null;
          id: string;
          status: string;
          title: string;
          updated_at: string;
          user_id: string;
          version: number;
        };
        Insert: {
          content?: Json;
          created_at?: string;
          folder_id?: string | null;
          id?: string;
          status?: string;
          title: string;
          updated_at?: string;
          user_id: string;
          version?: number;
        };
        Update: {
          content?: Json;
          created_at?: string;
          folder_id?: string | null;
          id?: string;
          status?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
          version?: number;
        };
        Relationships: [];
      };
      users: {
        Row: {
          clerk_user_id: string;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          plan: string;
          sop_quota: number;
          updated_at: string;
        };
        Insert: {
          clerk_user_id: string;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id?: string;
          plan?: string;
          sop_quota?: number;
          updated_at?: string;
        };
        Relationships: [];
        Update: {
          clerk_user_id?: string;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          plan?: string;
          sop_quota?: number;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
  storage: {
    Buckets: {
      Row: {
        id: string;
        name: string;
        owner: string | null;
        public: boolean;
        created_at: string;
        updated_at: string;
      };
      Insert: {
        id: string;
        name: string;
        owner?: string | null;
        public?: boolean;
        created_at?: string;
        updated_at?: string;
      };
      Update: {
        id?: string;
        name?: string;
        owner?: string | null;
        public?: boolean;
        created_at?: string;
        updated_at?: string;
      };
      Relationships: [];
    };
    Objects: {
      Row: {
        bucket_id: string | null;
        created_at: string | null;
        id: string;
        last_accessed_at: string | null;
        metadata: Json | null;
        name: string | null;
        owner: string | null;
        path_tokens: string[] | null;
        updated_at: string | null;
      };
      Insert: {
        bucket_id?: string | null;
        created_at?: string | null;
        id?: string;
        last_accessed_at?: string | null;
        metadata?: Json | null;
        name?: string | null;
        owner?: string | null;
        path_tokens?: string[] | null;
        updated_at?: string | null;
      };
      Update: {
        bucket_id?: string | null;
        created_at?: string | null;
        id?: string;
        last_accessed_at?: string | null;
        metadata?: Json | null;
        name?: string | null;
        owner?: string | null;
        path_tokens?: string[] | null;
        updated_at?: string | null;
      };
      Relationships: [];
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: boolean;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      get_size_by_bucket: {
        Args: Record<string, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
    };
  };
}
